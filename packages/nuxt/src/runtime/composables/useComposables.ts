import type { SiteDetectionMode } from '@query-api/vue'
import {
  getPreviewParams,
  normalizeBearerToken,
  getCurrentSite,
  getSiteUri,
  SITE_DETECTION_MODES,
  getValidSiteDetectionMode,
} from '@query-api/vue'
import { defu } from 'defu'
import { useRuntimeConfig, useRoute, createError, useRequestURL, useFetch } from 'nuxt/app'
import type { UseFetchOptions } from 'nuxt/app'
import { computed, unref } from 'vue'
import type { Ref } from 'vue'
import type { QueryApiOptions } from '../../types'

export function useCraftCurrentSite() {
  const { siteMap, siteDetectionMode } = useRuntimeConfig().public.craftcms as QueryApiOptions
  if (!siteMap || siteMap.length === 0) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Invalid sitemap configuration in nuxt.config.ts',
    })
  }

  const validSiteDetectionMode = getValidSiteDetectionMode(siteDetectionMode)
  const url = useUrlByMatching(validSiteDetectionMode)
  return computed(() => getCurrentSite(siteMap, url.value, validSiteDetectionMode))
}

export function useCraftUri() {
  const { siteDetectionMode } = useRuntimeConfig().public.craftcms as QueryApiOptions
  const currentSite = useCraftCurrentSite()
  const validSiteDetectionMode = getValidSiteDetectionMode(siteDetectionMode)
  const url = useUrlByMatching(validSiteDetectionMode)
  return computed(() => getSiteUri(url.value, currentSite.value, validSiteDetectionMode))
}

export function useCraftFetch<T>(
  url: Ref<string> | string | (() => string),
  options?: UseFetchOptions<T>,
): ReturnType<typeof useFetch<T>> {
  const authToken = useCraftAuthToken()
  const { query: queryParams } = useRoute()
  const previewParams = getPreviewParams(queryParams as Record<string, string>)
  const apiUrl = previewParams ? computed(() => `${unref(url)}&${previewParams}`) : url

  const defaults: UseFetchOptions<T> = {
    key: unref(apiUrl),
    headers: {
      Authorization: authToken,
    },
  }

  const { caching } = useRuntimeConfig().public.craftcms as QueryApiOptions
  if (caching) {
    if (typeof caching === 'object' && caching.ttl) {
      defaults.transform = (input) => {
        return {
          ...input,
          fetchedAt: new Date(),
        }
      }
      defaults.getCachedData = (key, nuxtApp) => {
        if (previewParams) return

        const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
        if (!data) {
          return
        }

        const expirationDate = new Date(data.fetchedAt)
        expirationDate.setTime(expirationDate.getTime() + caching.ttl)
        const isExpired = expirationDate.getTime() < Date.now()
        if (isExpired) {
          return
        }

        return data
      }
    } else {
      defaults.getCachedData = (key, nuxtApp) => {
        if (previewParams) return
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      }
    }
  }

  const params = defu(options, defaults)
  return useFetch(apiUrl, params) as ReturnType<typeof useFetch<T>>
}

export function useCraftAuthToken() {
  const { authToken } = useRuntimeConfig().public.craftcms as QueryApiOptions

  if (!authToken) {
    throw createError({
      statusCode: 500,
      statusMessage:
        'CraftCMS Auth Token is missing. Please provide a valid token in your nuxt.config.ts.',
    })
  }

  return normalizeBearerToken(authToken)
}

function useUrlByMatching(mode: SiteDetectionMode) {
  const useRequest = useRequestURL()
  const route = useRoute()
  const fullUrl = computed(() => useRequest.href)
  const fullPath = computed(() => route.path)
  return mode === SITE_DETECTION_MODES.PATH ? fullPath : fullUrl
}
