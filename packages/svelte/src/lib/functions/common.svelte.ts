import { getQueryApiConfig } from '../config.svelte'
import { browser } from '$app/environment'
import { page } from '$app/state'
import {
  normalizeBearerToken,
  getCurrentSite,
  getSiteUri,
  SITE_DETECTION_MODES,
  getValidSiteDetectionMode,
} from '@query-api/js'
import type { SiteDetectionMode } from '@query-api/js'
import { SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity'

/**
 * Returns the Bearer token for the Query API.
 */
export function getCraftAuthToken() {
  const { authToken } = getQueryApiConfig()
  if (!authToken) {
    throw new Error(
      'CraftCMS Auth Token is missing. Please provide a valid token in your craftInit().',
    )
  }
  return normalizeBearerToken(authToken)
}

export function getCraftCurrentSite() {
  const { siteMap, siteDetectionMode } = getQueryApiConfig()
  if (!siteMap || siteMap.length === 0) {
    throw new Error('Invalid sitemap configuration in nuxt.config.ts')
  }

  const validSiteDetectionMode = getValidSiteDetectionMode(siteDetectionMode)
  const url = getUrlByMode(validSiteDetectionMode)
  return getCurrentSite(siteMap, url, validSiteDetectionMode)
}

export function getCraftUri() {
  const { siteDetectionMode } = getQueryApiConfig()
  const validSiteDetectionMode = getValidSiteDetectionMode(siteDetectionMode)
  const currentSite = getCraftCurrentSite()
  const url = getUrlByMode(validSiteDetectionMode)
  return getSiteUri(url, currentSite, validSiteDetectionMode)
}

function getUrlByMode(mode: SiteDetectionMode) {
  const url = getEffectiveUrl()
  return mode === SITE_DETECTION_MODES.PATH ? url.pathname : url.href
}

export function getEffectiveUrl() {
  if (browser) {
    return new SvelteURL(page.url.href)
  }

  const { getRequestEvent } = getQueryApiConfig()
  if (getRequestEvent) {
    const evt = getRequestEvent()
    console.log(evt?.url)
    if (evt) return evt.url
  }

  throw new Error(
    'No URL available outside of a request context. ' +
      'Please provide getRequestEvent in your initQueryApi() config for SSR support.',
  )
}

export function getSearchParamsAsRecords() {
  const params = getSearchParams()
  return Object.fromEntries(params?.entries())
}

function getSearchParams() {
  if (browser) {
    return new SvelteURLSearchParams(window.location.search)
  }

  const { getRequestEvent } = getQueryApiConfig()
  if (getRequestEvent) {
    const evt = getRequestEvent()
    if (evt) return evt.url.searchParams
  }

  throw new Error(
    'No URL available outside of a request context. ' +
      'Please provide getRequestEvent in your initQueryApi() config for SSR support.',
  )
}
