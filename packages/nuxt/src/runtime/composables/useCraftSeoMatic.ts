import type { AsyncDataOptions } from 'nuxt/app'
import type { CraftCmsOptions } from '@query-api/vue'
import { useCraftCurrentSite, useCraftUri } from './useComposables'
import { useRuntimeConfig, useAsyncData, createError } from 'nuxt/app'
import { computed } from 'vue'
import type { Ref } from 'vue'

export type MetaTag = { content?: string, name?: string, property?: string }
export type MetaLink = { href: string, rel: string, hreflang?: string }
export type SeoData = {
  MetaTitleContainer: { title?: { title: string } }
  MetaTagContainer: Record<string, MetaTag | MetaTag[]>
  MetaLinkContainer: Record<string, MetaLink | MetaLink[]>
  MetaJsonLdContainer: Record<string, unknown>
}

export type TransformedSeoData = {
  title: string
  metaTags: Array<{
    hid: string
    name?: string
    property?: string
    content?: string
  }>
  linkTags: Array<{
    rel: string
    href: string
    hreflang?: string
  }>
  jsonLd: Record<string, unknown>
}

export interface CraftSeoMaticReturn<T> extends Promise<{
  data: Ref<T | null>
  error: Ref<Error | null>
  pending: Ref<boolean>
  refresh: () => Promise<void>
}> {
  data: Ref<T | null>
  pending: Ref<boolean>
  refresh: () => Promise<void>
  error: Ref<Error | null>
}

export function useCraftSeoMatic<T = TransformedSeoData>(
  url?: string,
  options: AsyncDataOptions<T> = {}): CraftSeoMaticReturn<T> {
  const config = useRuntimeConfig()
  const currentSite = useCraftCurrentSite()
  const currentUri = useCraftUri()

  const transformFunction = (seoMaticData: SeoData): TransformedSeoData | undefined => {
    if (!seoMaticData || typeof seoMaticData !== 'object') {
      console.error('Transformation of SEOmatic data failed, please verify that the SEOmatic endpoint is working correctly')
      return undefined
    }
    return {
      title: seoMaticData.MetaTitleContainer?.title?.title ?? '',
      metaTags: generateMetaTags(seoMaticData.MetaTagContainer),
      linkTags: generateLinkTags(seoMaticData.MetaLinkContainer),
      jsonLd: seoMaticData.MetaJsonLdContainer ?? {},
    }
  }

  const defaults = {
    transform: transformFunction,
  }

  const params = { ...defaults, ...options } as AsyncDataOptions<T>

  // Create a computed property for the API URL
  const computedApiUrl = computed(() => {
    if (url) return url

    if (!currentSite.value || !currentUri.value) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Current site or current uri is invalid in useCraftSeoMatic composable.',
      })
    }

    const { baseUrl } = config.public.craftcms as CraftCmsOptions
    return `${baseUrl}/actions/seomatic/meta-container/all-meta-containers/?asArray=true&uri=${encodeURIComponent(currentUri.value)}&siteId=${currentSite.value.id}`
  })

  return useAsyncData<T>(
    `seomatic:${computedApiUrl.value}`,
    () => {
      return $fetch(computedApiUrl.value)
    },
    params,
  ) as unknown as CraftSeoMaticReturn<T>
}

function generateMetaTags(metaTagContainer: Record<string, MetaTag | MetaTag[]>) {
  return Object.entries(metaTagContainer || {}).flatMap(([key, tag]) => {
    if (!tag || typeof tag !== 'object') return []
    if (Array.isArray(tag) && tag.length === 0) return []

    if (Array.isArray(tag)) {
      return tag.map(item => ({
        hid: `${key}-${item.content ?? ''}`,
        name: item.name ?? undefined,
        property: item.property ?? undefined,
        content: item.content ?? undefined,
      }))
    }

    return [{
      hid: key,
      name: tag.name ?? undefined,
      property: tag.property ?? undefined,
      content: tag.content ?? undefined,
    }]
  })
}

function generateLinkTags(linkTagContainer: Record<string, MetaLink | MetaLink[]>) {
  return Object.entries(linkTagContainer || {}).flatMap(([, tag]) => {
    if (!tag || typeof tag !== 'object') return []
    if (Array.isArray(tag) && tag.length === 0) return []

    if (Array.isArray(tag)) {
      return tag.map(item => ({
        rel: item.rel,
        href: item.href,
        hreflang: item.hreflang ?? undefined,
      }))
    }

    return [{
      rel: tag.rel,
      href: tag.href,
      hreflang: tag.hreflang ?? undefined,
    }]
  })
}
