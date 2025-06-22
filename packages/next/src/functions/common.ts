import type { CraftOptions, SiteDetectionMode } from '@query-api/react/core'
import { getCraftInstance, SITE_DETECTION_MODES } from '@query-api/react/core'
import { getCurrentSite, getSiteUri, normalizeBearerToken } from '@query-api/react/core'
import { getCraftSiteHeaders } from './middleware'
import { cache } from 'react'

async function getCraftCurrentSiteImpl() {
  const { siteMap, siteDetectionMode } = getCraftInstance() as Required<CraftOptions>
  if (!siteMap || siteMap.length === 0) {
    throw new Error('Invalid sitemap in craftInit()')
  }

  const url = await getUrlByMatching(siteDetectionMode)
  return getCurrentSite(siteMap, url, siteDetectionMode)
}
const getCraftCurrentSiteCached = cache(getCraftCurrentSiteImpl)

/**
 * Returns the current Craft CMS site object based on the site detection strategy and request headers.
 */
export async function getCraftCurrentSite() {
  return getCraftCurrentSiteCached()
}

export async function getCraftUriImpl() {
  const { siteDetectionMode } = getCraftInstance() as Required<CraftOptions>
  const currentSite = await getCraftCurrentSite()
  return getSiteUri(await getUrlByMatching(siteDetectionMode), currentSite, siteDetectionMode)
}
const getCraftUriCached = cache(getCraftUriImpl)

/**
 * Returns the current Craft URI for the site and request context.
 */
export async function getCraftUri() {
  return getCraftUriCached()
}

export function getCraftAuthTokenImpl() {
  const { authToken } = getCraftInstance()
  return normalizeBearerToken(authToken)
}
const getCraftAuthTokenCached = cache(getCraftAuthTokenImpl)

/**
 * Returns the normalized Bearer token for the Craft API.
 */
export function getCraftAuthToken() {
  return getCraftAuthTokenCached()
}

/**
 * Determines the relevant URL or path from the request headers according to the SiteDetectionMode.
 */

async function getUrlByMatching(mode: SiteDetectionMode) {
  const { url, path } = await getCraftSiteHeaders()
  const urlOrPath = mode === SITE_DETECTION_MODES.PATH ? path : url

  if (!urlOrPath) {
    throw new Error('Invalid url or path')
  }
  return urlOrPath
}
