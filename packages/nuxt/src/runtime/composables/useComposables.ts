import { siteDetectionModes, type CraftCmsOptions, type SiteDetectionMode } from '@query-api/vue'
import { getPreviewParams } from '@query-api/js'
import { defu } from 'defu'
import { useRuntimeConfig, useRoute, createError, useRequestURL, useFetch } from 'nuxt/app'
import type { UseFetchOptions } from 'nuxt/app'
import { computed, unref } from 'vue'
import type { Ref } from 'vue'
import { getBearerToken, getCurrentSite, getSiteUri } from '../utils/helper'

export function useCraftCurrentSite() {
  const { siteMap, siteDetectionMode } = useRuntimeConfig().public
    .craftcms as Required<CraftCmsOptions>
  if (!siteMap || siteMap.length === 0) {
    throw createError({ statusCode: 500, statusMessage: 'Invalid sitemap in app.config.ts' })
  }

  const url = useUrlByMatching(siteDetectionMode)
  return computed(() => getCurrentSite(siteMap, url, siteDetectionMode))
}

export function useCraftUri() {
  const { siteDetectionMode } = useRuntimeConfig().public.craftcms as Required<CraftCmsOptions>
  const currentSite = useCraftCurrentSite()
  return computed(() =>
    getSiteUri(useUrlByMatching(siteDetectionMode), currentSite, siteDetectionMode),
  )
}

export function useCraftFetch<T>(
  url: Ref<string> | string | (() => string),
  options?: UseFetchOptions<T>,
): ReturnType<typeof useFetch<T>> {
  // get bearer auth token
  const authToken = useCraftAuthToken()

  // get & set preview tokens
  const { query: queryParams } = useRoute()
  const previewParams = getPreviewParams(queryParams as Record<string, string>)
  const apiUrl = previewParams ? computed(() => `${unref(url)}&${previewParams}`) : url

  const defaults: UseFetchOptions<T> = {
    key: unref(apiUrl),
    headers: {
      Authorization: authToken,
    },
  }

  const params = defu(options, defaults)
  return useFetch(apiUrl, params) as ReturnType<typeof useFetch<T>>
}

export function useCraftAuthToken() {
  const { authToken } = useRuntimeConfig().public.craftcms as Required<CraftCmsOptions>

  if (!authToken) {
    throw createError({
      statusCode: 500,
      statusMessage:
        'CraftCMS Auth Token is missing. Please provide a valid token in your nuxt.config.ts.',
    })
  }

  return getBearerToken(authToken)
}

function useUrlByMatching(mode: SiteDetectionMode) {
  const useRequest = useRequestURL()
  const route = useRoute()
  const fullUrl = computed(() => useRequest.href)
  const fullPath = computed(() => route.path)
  return mode === siteDetectionModes.PATH ? fullPath : fullUrl
}
