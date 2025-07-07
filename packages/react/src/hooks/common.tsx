import { useCraftConfigContext, useCraftLocationContext } from './craftContext'
import { useMemo } from 'react'

import {
  normalizeBearerToken,
  getCurrentSite,
  getSiteUri,
  SITE_DETECTION_MODES,
  getValidSiteDetectionMode,
} from '@query-api/js'
import type { SiteDetectionMode } from '@query-api/js'

export function useCraftCurrentSite() {
  const { siteMap, siteDetectionMode } = useCraftConfigContext()
  if (!siteMap || siteMap.length === 0) {
    throw new Error(
      'Invalid sitemap configuration. Please provide a valid sitemap in your craftInit().',
    )
  }
  const validMode = getValidSiteDetectionMode(siteDetectionMode)
  const url = useUrlByMatching(validMode)
  return useMemo(() => getCurrentSite(siteMap, url, validMode), [siteMap, url, validMode])
}

export function useCraftUri() {
  const { siteDetectionMode } = useCraftConfigContext()
  const currentSite = useCraftCurrentSite()
  const validMode = getValidSiteDetectionMode(siteDetectionMode)
  const url = useUrlByMatching(validMode)
  return useMemo(() => getSiteUri(url, currentSite, validMode), [url, currentSite, validMode])
}

/**
 * Returns the normalized Bearer token for the Craft Query API.
 */
export function useCraftAuthToken() {
  const { authToken } = useCraftConfigContext()
  if (!authToken) {
    throw new Error(
      'CraftCMS Auth Token is missing. Please provide a valid token in your craftInit().',
    )
  }
  return normalizeBearerToken(authToken)
}

function useUrlByMatching(mode: SiteDetectionMode) {
  const location = useCraftLocationContext()

  return useMemo(() => {
    if (mode === SITE_DETECTION_MODES.PATH) {
      return location.pathname
    } else {
      return location.absoluteUrl
    }
  }, [mode, location])
}
