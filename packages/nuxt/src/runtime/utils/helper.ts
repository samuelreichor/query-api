import { type CraftSites, type CraftSite, type SiteDetectionMode, siteDetectionMode } from '@query-api/vue'
import type { Ref } from 'vue'

export function getCurrentSite(siteMap: CraftSites, url: Ref<string>, mode: SiteDetectionMode): CraftSite {
  const sortedSiteMap = getSortedSitesByMatching(siteMap, mode)
  return sortedSiteMap.find(site => url.value.startsWith(getSiteByMatching(site, mode))) ?? siteMap[0]
}

export function getSiteUri(url: Ref<string>, currentSite: Ref<CraftSite>, mode: SiteDetectionMode): string {
  const normUrl = normalizeUrl(url.value)
    .split('#')[0] // Remove hash fragment
    .split('?')[0] // Remove query parameters
    .replace(normalizeUrl(getSiteByMatching(currentSite.value, mode)), '') // Remove origin
    .replace(/^\/+/, '') // Remove leading slashes
    .replace(/\/+$/, '') // Remove trailing slashes

  return normUrl === '' ? '__home__' : normUrl
}

export function normalizeUrl(url: string) {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
}

export function getSiteByMatching(currentSite: CraftSite, mode: SiteDetectionMode) {
  return mode === siteDetectionMode.PATH ? currentSite.path! : currentSite.origin!
}

export function getSortedSitesByMatching(siteMap: CraftSites, mode: SiteDetectionMode) {
  return [...siteMap].sort((a, b) => {
    const keyA = mode === siteDetectionMode.PATH ? a.path || '' : a.origin || ''
    const keyB = mode === siteDetectionMode.PATH ? b.path || '' : b.origin || ''

    return keyB.length - keyA.length
  })
}

export function getBearerToken(token: string) {
  const trimmedToken = token.trim()
  if (trimmedToken.startsWith('Bearer')) {
    return trimmedToken
  }

  if (trimmedToken.startsWith('bearer')) {
    return trimmedToken
  }

  return `Bearer ${trimmedToken}`
}
