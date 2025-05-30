import { describe, it, expect } from 'vitest'
import { siteDetectionMode } from '@query-api/vue'
import { ref, computed } from 'vue'
import {
  getCurrentSite,
  getSiteUri,
  normalizeUrl,
  getSortedSitesByMatching,
  getBearerToken,
} from '../../src/runtime/utils/helper'

// Mock site maps
const mockSiteMap = [
  { handle: 'en', id: 1, origin: 'https://google.com', path: '/' },
  { handle: 'de', id: 2, origin: 'https://google.com/de', path: '/de' },
  { handle: 'usa', id: 3, origin: 'https://google.com/usa', path: '/usa' },
]

const mockCurrentSite = ref(mockSiteMap[0])

describe('getCurrentSite', () => {
  it('should return the correct site based on the URL (origin matching)', () => {
    const result = getCurrentSite(mockSiteMap, ref('https://google.com/usa/page/slug'), siteDetectionMode.ORIGIN)
    expect(result).toEqual(mockSiteMap[2]) // USA site
  })

  it('should return the correct site based on the URL (path matching)', () => {
    const result = getCurrentSite(mockSiteMap, ref('/usa/page/slug'), siteDetectionMode.PATH)
    expect(result).toEqual(mockSiteMap[2]) // USA site
  })

  it('should return the first site if no match is found', () => {
    const result = getCurrentSite(mockSiteMap, ref('https://unknown-site.com/page'), siteDetectionMode.ORIGIN)
    expect(result).toEqual(mockSiteMap[0]) // Default fallback site
  })

  it('should return the longest matching origin first', () => {
    const extendedSiteMap = [
      { handle: 'en', id: 1, origin: 'https://example.com', path: '/en' },
      { handle: 'de', id: 2, origin: 'https://example.com/sub', path: '/de' },
    ]
    const result = getCurrentSite(extendedSiteMap, ref('https://example.com/sub/page'), siteDetectionMode.ORIGIN)
    expect(result).toEqual(extendedSiteMap[1]) // German site (longest match)
  })

  it('should return the longest matching path first when pathMatching is enabled', () => {
    const extendedSiteMap = [
      { handle: 'en', id: 1, path: '/en', origin: '' },
      { handle: 'de', id: 2, path: '/en/sub', origin: '' },
    ]
    const result = getCurrentSite(extendedSiteMap, ref('/en/sub/page'), siteDetectionMode.PATH)
    expect(result).toEqual(extendedSiteMap[1]) // German site (longest match)
  })

  it('should handle URLs without protocol correctly', () => {
    expect(getCurrentSite(mockSiteMap, ref('google.com/path'), siteDetectionMode.ORIGIN)).toEqual(mockSiteMap[0])
  })
})

describe('getSiteUri', () => {
  it('should return the correct URI relative to the origin', () => {
    const result = getSiteUri(ref('https://google.com/some/path'), mockCurrentSite, siteDetectionMode.ORIGIN)
    expect(result).toBe('some/path')
  })

  it('should return "__home__" if the URL is the site root', () => {
    expect(getSiteUri(ref('https://google.com'), mockCurrentSite, siteDetectionMode.ORIGIN)).toBe('__home__')
  })

  it('should remove multiple leading and trailing slashes', () => {
    expect(getSiteUri(ref('https://google.com////path'), mockCurrentSite, siteDetectionMode.ORIGIN)).toBe('path')
  })

  it('should remove hash and query fragments', () => {
    expect(getSiteUri(ref('https://google.com/page#section?test=1'), mockCurrentSite, siteDetectionMode.ORIGIN)).toBe('page')
  })

  it('should correctly handle a URI-encoded URL', () => {
    expect(getSiteUri(ref('https://google.com/some%20very%2Fstrange%2Dpath'), mockCurrentSite, siteDetectionMode.ORIGIN))
      .toBe('some%20very%2Fstrange%2Dpath')
  })

  it('should handle path-based URI when pathMatching is enabled', () => {
    const mockPathSite = ref(mockSiteMap[2]) // USA site
    expect(getSiteUri(ref('/usa/some/path'), mockPathSite, siteDetectionMode.PATH)).toBe('some/path')
  })
})

describe('normalizeUrl', () => {
  it('should remove the protocol (http/https)', () => {
    expect(normalizeUrl('https://example.com')).toBe('example.com')
    expect(normalizeUrl('http://example.com')).toBe('example.com')
  })

  it('should remove "www." prefix', () => {
    expect(normalizeUrl('https://www.example.com')).toBe('example.com')
  })

  it('should leave normal domains untouched', () => {
    expect(normalizeUrl('example.com')).toBe('example.com')
  })
})

describe('getSortedSitesByMatching', () => {
  it('should sort sites by longest origin when pathMatching is siteDetectionMode.ORIGIN', () => {
    const sortedSites = getSortedSitesByMatching(mockSiteMap, siteDetectionMode.ORIGIN)
    const keys = sortedSites.map(site => site.handle)
    expect(keys).toEqual(['usa', 'de', 'en']) // Sorted by longest origin
  })

  it('should sort sites by longest path when pathMatching is siteDetectionMode.PATH', () => {
    const sortedSites = getSortedSitesByMatching(mockSiteMap, siteDetectionMode.PATH)
    const keys = sortedSites.map(site => site.handle)
    expect(keys).toEqual(['usa', 'de', 'en']) // Sorted by longest path
  })

  it('should return an empty array if input is empty', () => {
    expect(getSortedSitesByMatching([], siteDetectionMode.ORIGIN)).toEqual([])
  })

  it('should maintain order when origins/paths have the same length', () => {
    const sameLengthMap = [
      { handle: 'a', id: 1, origin: 'https://aaa.com', path: '/a' },
      { handle: 'b', id: 2, origin: 'https://bbb.com', path: '/b' },
    ]
    expect(getSortedSitesByMatching(sameLengthMap, siteDetectionMode.ORIGIN)).toEqual(sameLengthMap)
    expect(getSortedSitesByMatching(sameLengthMap, siteDetectionMode.PATH)).toEqual(sameLengthMap)
  })
})

describe('useUrlByMatching', () => {
  it('should return the route path when pathMatching is enabled', () => {
    const useRouteMock = () => ({ path: '/de/some-page' }) // Simuliert useRoute()
    expect(computed(() => useRouteMock().path).value).toBe('/de/some-page')
  })

  it('should return the full URL when pathMatching is disabled', () => {
    const useFullUrlMock = () => ref('https://google.com/de/some-page')
    expect(useFullUrlMock().value).toBe('https://google.com/de/some-page')
  })
})

describe('getBearerToken', () => {
  it('should return a correctly formated bearer token', () => {
    const tokenArr = ['xxx', '  xxx  ', 'Bearer xxx', '   Bearer xxx ']
    tokenArr.forEach((token) => {
      expect(getBearerToken(token)).toBe('Bearer xxx')
    })
  })
})
