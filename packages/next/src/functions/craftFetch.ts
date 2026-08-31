import { getCraftAuthToken } from './common'
import type { ElementType } from '@query-api/js'
import { buildCraftQueryUrl, getPreviewParams } from '@query-api/js'
import { getCraftInstance } from '@query-api/react/core'
import type { CraftOptions } from '@query-api/react/core'
import { getCraftPreviewHeaders } from './middleware'

/**
 * Classifies why a request made by `getCraftData()` failed:
 * - `http`: the server responded with a non-2xx status.
 * - `network`: the request never got a response (DNS, TLS, connection refused, ...).
 * - `parse`: the response body could not be parsed as JSON.
 */
export type CraftFetchErrorKind = 'http' | 'network' | 'parse'

/**
 * Error thrown by `getCraftData()`. Keeps the HTTP status and the raw
 * response body available so callers can tell a WAF block or proxy error
 * apart from a genuine API error.
 */
export class CraftFetchError extends Error {
  kind: CraftFetchErrorKind
  status?: number
  statusText?: string
  body?: string

  constructor(
    message: string,
    options: {
      kind: CraftFetchErrorKind
      status?: number
      statusText?: string
      body?: string
      cause?: unknown
    },
  ) {
    super(message, { cause: options.cause })
    this.name = 'CraftFetchError'
    this.kind = options.kind
    this.status = options.status
    this.statusText = options.statusText
    this.body = options.body
  }
}

/**
 * Fetches data from the Craft API for a given query URL.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getCraftData<ResT = any>(queryUrl: string, options: RequestInit = {}) {
  const authToken = getCraftAuthToken()
  const url = await buildFullApiUrl(queryUrl)
  let error: CraftFetchError | null = null
  let data: ResT | null = null
  try {
    let response: Response
    try {
      response = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: authToken,
        },
      })
    } catch (err) {
      throw new CraftFetchError(`Fetch for ${url} failed: ${(err as Error).message}`, {
        kind: 'network',
        cause: err,
      })
    }

    const body = await response.text()

    if (!response.ok) {
      let apiMessage: string | undefined
      try {
        apiMessage = JSON.parse(body)?.message
      } catch {
        // Non-JSON error body (e.g. an HTML page from a WAF or proxy) — the
        // status code is the error, the raw body stays available on `body`.
      }
      throw new CraftFetchError(
        `Fetch for ${url} failed with status ${response.status}${apiMessage ? `: ${apiMessage}` : ''}`,
        {
          kind: 'http',
          status: response.status,
          statusText: response.statusText,
          body,
        },
      )
    }

    try {
      data = JSON.parse(body)
    } catch (err) {
      throw new CraftFetchError(`Fetch for ${url} returned a non-JSON response body`, {
        kind: 'parse',
        status: response.status,
        statusText: response.statusText,
        body,
        cause: err,
      })
    }
  } catch (err) {
    error =
      err instanceof CraftFetchError
        ? err
        : new CraftFetchError(`Fetch for ${url} failed: ${(err as Error).message}`, {
            kind: 'network',
            cause: err,
          })
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
