import { useCraftAuthToken } from './common'
import type { ElementType } from '@query-api/js'
import { buildCraftQueryUrl } from '@query-api/js'
import { useCraftConfigContext } from './craftContext'
import { useEffect, useState } from 'react'

/**
 * React hook to fetch data from the Craft API with authentication and custom fetch options.
 * Returns an object containing the response data, loading state, and error message (if any).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useCraftData<ResT = any>(queryUrl: string, options: RequestInit = {}) {
  const [data, setData] = useState<ResT | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const authToken = useCraftAuthToken()
  const { baseUrl, debug } = useCraftConfigContext()
  const url = `${baseUrl}${queryUrl}`

  if (debug) {
    console.log(url)
  }

  useEffect(() => {
    if (!url || !authToken) {
      throw new Error('Please provide a valid url and auth token')
    }

    setLoading(true)
    setError(null)

    fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: authToken,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [url, authToken, JSON.stringify(options)])

  return { data, loading, error }
}

/**
 * Returns a query builder for the specified Craft element type.
 */
export function useCraftQuery<ResT, T extends ElementType>(elementType: T) {
  const queryBuilder = buildCraftQueryUrl<T>(elementType)

  return {
    ...queryBuilder,

    one() {
      const queryUrl = queryBuilder.buildBaseUrl('one')
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useCraftData<ResT>(queryUrl)
    },

    all() {
      const queryUrl = queryBuilder.buildBaseUrl('all')
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useCraftData<ResT>(queryUrl)
    },
  }
}

/**
 * Returns a query builder for Craft entries.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useCraftEntry<ResT = any>() {
  return useCraftQuery<ResT, 'entries'>('entries')
}

/**
 * Returns a query builder for Craft entries.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useCraftUser<ResT = any>() {
  return useCraftQuery<ResT, 'users'>('users')
}

/**
 * Returns a query builder for Craft entries.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useCraftAsset<ResT = any>() {
  return useCraftQuery<ResT, 'assets'>('assets')
}

/**
 * Returns a query builder for Craft entries.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useCraftAddress<ResT = any>() {
  return useCraftQuery<ResT, 'addresses'>('addresses')
}
