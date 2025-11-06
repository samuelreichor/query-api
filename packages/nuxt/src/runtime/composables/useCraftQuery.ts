import { buildCraftQueryUrl, getPreviewParams } from '@query-api/vue'
import type { CraftCmsOptions, ElementType, ExecutionMethod, QueryBuilder } from '@query-api/vue'
import { useRuntimeConfig, useRoute } from 'nuxt/app'
import type { AsyncData, NuxtError } from 'nuxt/app'
import type { LocationQuery } from 'vue-router'
import { useCraftFetch } from './useComposables'

function constuctUrl(
  baseUrl: string,
  queryUrl: string,
  debug: boolean,
  queryParams: LocationQuery,
) {
  if (!(baseUrl || queryUrl || queryParams)) {
    throw new Error('Please provide baseUrl, queryUrl and queryParams for constructUrl function.')
  }

  let url = `${baseUrl}${queryUrl}`

  const previewParams = getPreviewParams(queryParams as Record<string, string>)

  if (previewParams) {
    url += `&${previewParams}`
  }

  if (debug) {
    console.log(url)
  }

  return url
}

export type PickFrom<T, K extends Array<string>> =
  T extends Array<unknown>
    ? T
    : T extends Record<string, unknown>
      ? keyof T extends K[number]
        ? T
        : K[number] extends never
          ? T
          : Pick<T, K[number]>
      : T
export type KeysOf<T> = Array<T extends T ? (keyof T extends string ? keyof T : never) : never>

type ReturnType<ResT, T extends ElementType> = QueryBuilder<T> & {
  one(): AsyncData<PickFrom<ResT, KeysOf<ResT>> | null, NuxtError<unknown> | null>
  all(): AsyncData<PickFrom<ResT, KeysOf<ResT>> | null, NuxtError<unknown> | null>
  buildUrl(execOpt: ExecutionMethod): string
}

export function useCraftQuery<ResT, T extends ElementType>(elementType: T): ReturnType<ResT, T> {
  const queryBuilder = buildCraftQueryUrl(elementType, { autoPreview: false })
  const { baseUrl, debug } = useRuntimeConfig().public.craftcms as Required<CraftCmsOptions>
  const { query: queryParams } = useRoute()

  return {
    ...queryBuilder,

    buildUrl(execOpt) {
      const queryUrl = queryBuilder.buildBaseUrl(execOpt)
      return constuctUrl(baseUrl, queryUrl, debug, queryParams)
    },

    one() {
      const queryUrl = queryBuilder.buildBaseUrl('one')
      const url = constuctUrl(baseUrl, queryUrl, debug, queryParams)
      return useCraftFetch<ResT>(url)
    },

    all() {
      const queryUrl = queryBuilder.buildBaseUrl('all')
      const url = constuctUrl(baseUrl, queryUrl, debug, queryParams)
      return useCraftFetch<ResT>(url)
    },
  } as ReturnType<ResT, T>
}

export function useCraftEntry<ResT>() {
  return useCraftQuery<ResT, 'entries'>('entries')
}

export function useCraftAddress<ResT>() {
  return useCraftQuery<ResT, 'addresses'>('addresses')
}

export function useCraftAsset<ResT>() {
  return useCraftQuery<ResT, 'assets'>('assets')
}

export function useCraftUser<ResT>() {
  return useCraftQuery<ResT, 'users'>('users')
}
