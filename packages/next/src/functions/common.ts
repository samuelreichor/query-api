import type { CraftOptions, SiteDetectionMode } from '@query-api/react'
import { getCraftInstance, siteDetectionModes } from '@query-api/react'
import { getCurrentSite, getSiteUri, normalizeBearerToken } from '../utils/helper'
import { getCraftSiteHeaders } from './middleware'

export async function getCraftCurrentSite() {
  const { siteMap, siteDetectionMode } = getCraftInstance() as Required<CraftOptions>
  if (!siteMap || siteMap.length === 0) {
    throw new Error('Invalid sitemap in craftInit()')
  }

  const url = await getUrlByMatching(siteDetectionMode)
  return getCurrentSite(siteMap, url, siteDetectionMode)
}

export async function getCraftUri() {
  const { siteDetectionMode } = getCraftInstance() as Required<CraftOptions>
  const currentSite = await getCraftCurrentSite()
  return getSiteUri(await getUrlByMatching(siteDetectionMode), currentSite, siteDetectionMode)
}

export function getCraftAuthToken() {
  const { authToken } = getCraftInstance()
  return normalizeBearerToken(authToken)
}

async function getUrlByMatching(mode: SiteDetectionMode) {
  const { url, path } = await getCraftSiteHeaders()
  const urlOrPath = mode === siteDetectionModes.PATH ? path : url

  if (!urlOrPath) {
    throw new Error('Invalid url or path')
  }
  return urlOrPath
}
