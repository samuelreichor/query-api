import { SITE_DETECTION_MODES } from '../constants'
import type { SiteDetectionMode, CraftSites, CraftSite } from '../types'

export function normalizeUrl(url: string) {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '')
}

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

export function getSiteByMatching(currentSite: CraftSite, mode: SiteDetectionMode) {
  return mode === SITE_DETECTION_MODES.PATH ? currentSite.path : currentSite.origin
}

export function getSortedSitesByMatching(siteMap: CraftSites, mode: SiteDetectionMode) {
  return [...siteMap].sort((a, b) => {
    const keyA = mode === SITE_DETECTION_MODES.PATH ? a.path || '' : a.origin || ''
    const keyB = mode === SITE_DETECTION_MODES.PATH ? b.path || '' : b.origin || ''

    return keyB.length - keyA.length
  })
}

export function getValidSiteDetectionMode(mode: SiteDetectionMode = 'path') {
  if (Object.values(SITE_DETECTION_MODES).includes(mode)) {
    return mode
  }
  return SITE_DETECTION_MODES.PATH
}
