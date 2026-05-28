import { getQueryApiConfig } from '../config.svelte'
import type { ElementType, ExecutionMethod } from '@query-api/js'
import { buildCraftQueryUrl, getPreviewParams } from '@query-api/js'
import { getSearchParamsAsRecords } from './common.svelte'

/**
 * Fetch data from the Craft API with authentication and custom fetch options.
 */
export async function getCraftData<ResT = unknown>(queryUrl: string, options: RequestInit = {}) {
  const { authToken } = getQueryApiConfig()
  if (!authToken) throw new Error('Missing authToken')
  if (!queryUrl) throw new Error('Missing query url')

  try {
    const res = await fetch(queryUrl, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: authToken,
      },
    })

    const text = await res.text()
    if (!res.ok) {
      throw new Error(
        `[craftFetch] ${res.status} ${res.statusText} at ${queryUrl}\n` +
          `Body: ${text.slice(0, 500)}`,
      )
    }

    return (text ? JSON.parse(text) : {}) as ResT
  } catch (err) {
    console.error('[craftFetch] Network error:', err)
    throw err
  }
}

/**
 * Returns a query builder for the specified Craft element type.
 */
export function getCraftQuery<ResT, T extends ElementType>(elementType: T) {
  const queryBuilder = buildCraftQueryUrl<T>(elementType)
  const { baseUrl, debug } = getQueryApiConfig()

  const getParams = () => {
    try {
      return getSearchParamsAsRecords()
    } catch {
      return {}
    }
  }

  return {
    ...queryBuilder,

    buildUrl(execOpt: ExecutionMethod) {
      const queryUrl = queryBuilder.buildBaseUrl(execOpt)
      return constuctUrl(baseUrl, queryUrl, debug ?? false, getParams())
    },

    one() {
      const queryUrl = queryBuilder.buildBaseUrl('one')
      const fullUrl = constuctUrl(baseUrl, queryUrl, debug ?? false, getParams())
      return getCraftData<ResT>(fullUrl)
    },

    all() {
      const queryUrl = queryBuilder.buildBaseUrl('all')
      const fullUrl = constuctUrl(baseUrl, queryUrl, debug ?? false, getParams())
      return getCraftData<ResT>(fullUrl)
    },
  }
}

/**
 * Returns a query builder for Craft entries.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCraftEntry<ResT = any>() {
  return getCraftQuery<ResT, 'entries'>('entries')
}

/**
 * Returns a query builder for Craft users.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCraftUser<ResT = any>() {
  return getCraftQuery<ResT, 'users'>('users')
}

/**
 * Returns a query builder for Craft assets.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCraftAsset<ResT = any>() {
  return getCraftQuery<ResT, 'assets'>('assets')
}

/**
 * Returns a query builder for Craft addresses.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCraftAddress<ResT = any>() {
  return getCraftQuery<ResT, 'addresses'>('addresses')
}

/* Todo: add this to js library */
function constuctUrl(
  baseUrl: string,
  queryUrl: string,
  debug: boolean,
  queryParams: Record<string, string>,
) {
  if (!(baseUrl || queryUrl || queryParams)) {
    throw new Error('Please provide baseUrl, queryUrl and queryParams for constructUrl function.')
  }

  let url = `${baseUrl}${queryUrl}`

  const previewParams = getPreviewParams(queryParams)

  if (previewParams) {
    url += `&${previewParams}`
  }

  if (debug) {
    console.log(url)
  }

  return url
}
