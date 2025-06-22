import { getCraftAuthToken } from './common'
import type { ElementType } from '@query-api/js'
import { buildCraftQueryUrl, getPreviewParams } from '@query-api/js'
import { getCraftInstance } from '@query-api/react/core'
import type { CraftOptions } from '@query-api/react/core'
import { getCraftPreviewHeaders } from './middleware'

/**
 * Fetches data from the Craft API for a given query URL.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getCraftData<ResT = any>(queryUrl: string, options: RequestInit = {}) {
  const authToken = getCraftAuthToken()
  const url = await buildFullApiUrl(queryUrl)
  let error: Error | null = null
  let data: ResT | null = null
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: authToken,
      },
    })

    if (!response.ok) {
      const errorJson = await response.json()
      throw new Error(
        `Fetch for ${url} failed with status ${response.status}: ${errorJson.message}`,
      )
    }

    data = await response.json()
  } catch (err) {
    error = err as Error
    data = null
  }

  return { data, error }
}

/**
 * Returns a query builder for the specified Craft element type.
 */
export function getCraftQuery<ResT, T extends ElementType>(elementType: T) {
  const queryBuilder = buildCraftQueryUrl(elementType, { autoPreview: false })
  return {
    ...queryBuilder,

    async one() {
      const queryUrl = queryBuilder.buildBaseUrl('one')
      return await getCraftData<ResT>(queryUrl)
    },

    async all() {
      const queryUrl = queryBuilder.buildBaseUrl('all')
      return await getCraftData<ResT>(queryUrl)
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
 * Returns a query builder for Craft entries.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCraftUser<ResT = any>() {
  return getCraftQuery<ResT, 'users'>('users')
}

/**
 * Returns a query builder for Craft entries.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCraftAsset<ResT = any>() {
  return getCraftQuery<ResT, 'assets'>('assets')
}

/**
 * Returns a query builder for Craft entries.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCraftAddress<ResT = any>() {
  return getCraftQuery<ResT, 'addresses'>('addresses')
}

async function buildFullApiUrl(queryUrl: string) {
  const { baseUrl, debug } = getCraftInstance() as Required<CraftOptions>
  const previewParams = getPreviewParams(await getCraftPreviewHeaders())
  const url = `${baseUrl}${queryUrl}${previewParams ? `&${previewParams}` : ''}`
  if (debug) {
    console.log(url)
  }
  return url
}
