import { describe, it, expect } from 'vitest'
import { SITE_DETECTION_MODES } from '../../src/constants'
import {
  getCurrentSite,
  getSiteUri,
  normalizeUrl,
  getSortedSitesByMatching,
  getValidSiteDetectionMode,
} from '../../src/utils/multisite'

// Mock site maps
const mockSiteMap = [
  { handle: 'en', id: 1, origin: 'https://google.com', path: '/' },
  { handle: 'de', id: 2, origin: 'https://google.com/de', path: '/de' },
  { handle: 'usa', id: 3, origin: 'https://google.com/usa', path: '/usa' },
]

const mockCurrentSite = mockSiteMap[0]

describe('getCurrentSite', () => {
  it('should return the correct site based on the URL (origin matching)', () => {
    const result = getCurrentSite(
      mockSiteMap,
      'https://google.com/usa/page/slug',
      SITE_DETECTION_MODES.ORIGIN,
    )
    expect(result).toEqual(mockSiteMap[2]) // USA site
  })

  it('should return the correct site based on the URL (path matching)', () => {
    const result = getCurrentSite(mockSiteMap, '/usa/page/slug', SITE_DETECTION_MODES.PATH)
    expect(result).toEqual(mockSiteMap[2]) // USA site
  })

  it('should return the first site if no match is found', () => {
    const result = getCurrentSite(
      mockSiteMap,
      'https://unknown-site.com/page',
      SITE_DETECTION_MODES.ORIGIN,
    )
    expect(result).toEqual(mockSiteMap[0]) // Default fallback site
  })
  it('should return the longest matching origin first', () => {
    const extendedSiteMap = [
      { handle: 'en', id: 1, origin: 'https://example.com', path: '/en' },
      { handle: 'de', id: 2, origin: 'https://example.com/sub', path: '/de' },
    ]
    const result = getCurrentSite(
      extendedSiteMap,
      'https://example.com/sub/page',
      SITE_DETECTION_MODES.ORIGIN,
    )
    expect(result).toEqual(extendedSiteMap[1]) // German site (longest match)
  })

  it('should return the longest matching path first when pathMatching is enabled', () => {
    const extendedSiteMap = [
      { handle: 'en', id: 1, path: '/en', origin: '' },
      { handle: 'de', id: 2, path: '/en/sub', origin: '' },
    ]
    const result = getCurrentSite(extendedSiteMap, '/en/sub/page', SITE_DETECTION_MODES.PATH)
    expect(result).toEqual(extendedSiteMap[1]) // German site (longest match)
  })

  it('should handle URLs without protocol correctly', () => {
    expect(getCurrentSite(mockSiteMap, 'google.com/path', SITE_DETECTION_MODES.ORIGIN)).toEqual(
      mockSiteMap[0],
    )
  })
})

describe('getSiteUri', () => {
  it('should return the correct URI relative to the origin', () => {
    const result = getSiteUri(
      'https://google.com/some/path',
      mockCurrentSite,
      SITE_DETECTION_MODES.ORIGIN,
    )
    expect(result).toBe('some/path')
  })

  it('should return "__home__" if the URL is the site root', () => {
    expect(getSiteUri('https://google.com', mockCurrentSite, SITE_DETECTION_MODES.ORIGIN)).toBe(
      '__home__',
    )
  })

  it('should remove multiple leading and trailing slashes', () => {
    expect(
      getSiteUri('https://google.com////path', mockCurrentSite, SITE_DETECTION_MODES.ORIGIN),
    ).toBe('path')
  })

  it('should remove hash and query fragments', () => {
    expect(
      getSiteUri(
        'https://google.com/page#section?test=1',
        mockCurrentSite,
        SITE_DETECTION_MODES.ORIGIN,
      ),
    ).toBe('page')
  })

  it('should correctly handle a URI-encoded URL', () => {
    expect(
      getSiteUri(
        'https://google.com/some%20very%2Fstrange%2Dpath',
        mockCurrentSite,
        SITE_DETECTION_MODES.ORIGIN,
      ),
    ).toBe('some%20very%2Fstrange%2Dpath')
  })

  it('should handle path-based URI when pathMatching is enabled', () => {
    const mockPathSite = mockSiteMap[2] // USA site
    expect(getSiteUri('/usa/some/path', mockPathSite, SITE_DETECTION_MODES.PATH)).toBe('some/path')
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
  it('should sort sites by longest origin when pathMatching is SITE_DETECTION_MODES.ORIGIN', () => {
    const sortedSites = getSortedSitesByMatching(mockSiteMap, SITE_DETECTION_MODES.ORIGIN)
    const keys = sortedSites.map((site) => site.handle)
    expect(keys).toEqual(['usa', 'de', 'en']) // Sorted by longest origin
  })

  it('should sort sites by longest path when pathMatching is SITE_DETECTION_MODES.PATH', () => {
    const sortedSites = getSortedSitesByMatching(mockSiteMap, SITE_DETECTION_MODES.PATH)
    const keys = sortedSites.map((site) => site.handle)
    expect(keys).toEqual(['usa', 'de', 'en']) // Sorted by longest path
  })

  it('should return an empty array if input is empty', () => {
    expect(getSortedSitesByMatching([], SITE_DETECTION_MODES.ORIGIN)).toEqual([])
  })

  it('should maintain order when origins/paths have the same length', () => {
    const sameLengthMap = [
      { handle: 'a', id: 1, origin: 'https://aaa.com', path: '/a' },
      { handle: 'b', id: 2, origin: 'https://bbb.com', path: '/b' },
    ]
    expect(getSortedSitesByMatching(sameLengthMap, SITE_DETECTION_MODES.ORIGIN)).toEqual(
      sameLengthMap,
    )
    expect(getSortedSitesByMatching(sameLengthMap, SITE_DETECTION_MODES.PATH)).toEqual(
      sameLengthMap,
    )
  })
})

describe('getValidSiteDetectionMode', () => {
  it('should return the mode if it is a valid site detection mode', () => {
    expect(getValidSiteDetectionMode(SITE_DETECTION_MODES.PATH)).toBe(SITE_DETECTION_MODES.PATH)
    expect(getValidSiteDetectionMode(SITE_DETECTION_MODES.ORIGIN)).toBe(SITE_DETECTION_MODES.ORIGIN)
  })

  it('should return the default mode (PATH) for any invalid input', () => {
    // @ts-expect-error - Intentionally passing an invalid type for testing
    expect(getValidSiteDetectionMode('invalid-mode')).toBe(SITE_DETECTION_MODES.PATH)
  })
})
