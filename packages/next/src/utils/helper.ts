import type { SiteDetectionMode, CraftSites, CraftSite } from '@query-api/react'
import { siteDetectionModes } from '@query-api/react'

export function getCurrentSite(siteMap: CraftSites, url: string, mode: SiteDetectionMode) {
  const sortedSiteMap = getSortedSitesByMatching(siteMap, mode)
  return sortedSiteMap.find((site) => url.startsWith(getSiteByMatching(site, mode))) ?? siteMap[0]
}

export function getSiteUri(url: string, currentSite: CraftSite, mode: SiteDetectionMode) {
  const normUrl = normalizeUrl(url)
    .split('#')[0] // Remove hash fragment
    .split('?')[0] // Remove query parameters
    .replace(normalizeUrl(getSiteByMatching(currentSite, mode)), '') // Remove origin
    .replace(/^\/+/, '') // Remove leading slashes
    .replace(/\/+$/, '') // Remove trailing slashes

  return normUrl === '' ? '__home__' : normUrl
}

export function normalizeUrl(url: string) {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '')
}

export function getSiteByMatching(currentSite: CraftSite, mode: SiteDetectionMode) {
  return mode === siteDetectionModes.PATH ? currentSite.path : currentSite.origin
}

export function getSortedSitesByMatching(siteMap: CraftSites, mode: SiteDetectionMode) {
  return [...siteMap].sort((a, b) => {
    const keyA = mode === siteDetectionModes.PATH ? a.path || '' : a.origin || ''
    const keyB = mode === siteDetectionModes.PATH ? b.path || '' : b.origin || ''

    return keyB.length - keyA.length
  })
}

export function normalizeBearerToken(token: string) {
  const trimmedToken = token.trim()
  if (trimmedToken.startsWith('Bearer')) {
    return trimmedToken
  }

  if (trimmedToken.startsWith('bearer')) {
    return trimmedToken
  }

  return `Bearer ${trimmedToken}`
}
