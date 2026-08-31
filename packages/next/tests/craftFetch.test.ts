import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getCraftData, CraftFetchError } from '../src/functions/craftFetch'

vi.mock('../src/functions/common', () => ({
  getCraftAuthToken: () => 'Bearer test-token',
}))

vi.mock('../src/functions/middleware', () => ({
  getCraftPreviewHeaders: async () => ({}),
}))

vi.mock('@query-api/react/core', () => ({
  getCraftInstance: () => ({
    baseUrl: 'https://craft.test/v1/api/queryApi/customQuery',
    debug: false,
  }),
}))

describe('getCraftData', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns parsed data on a successful JSON response', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ title: 'Home' }), { status: 200 }),
    )

    const { data, error } = await getCraftData('?elementType=entries&one=1')

    expect(error).toBeNull()
    expect(data).toEqual({ title: 'Home' })
  })

  it('classifies a JSON error response as an http error with the api message', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: 'Not found' }), {
        status: 404,
        statusText: 'Not Found',
      }),
    )

    const { data, error } = await getCraftData('?elementType=entries&one=1')

    expect(data).toBeNull()
    expect(error).toBeInstanceOf(CraftFetchError)
    expect(error?.kind).toBe('http')
    expect(error?.status).toBe(404)
    expect(error?.message).toContain('404')
    expect(error?.message).toContain('Not found')
  })

  it('keeps the status code when the error response body is not JSON (e.g. a WAF block)', async () => {
    const htmlBody = '<html><body>Access denied</body></html>'
    vi.mocked(fetch).mockResolvedValue(
      new Response(htmlBody, { status: 403, statusText: 'Forbidden' }),
    )

    const { data, error } = await getCraftData('?elementType=entries&one=1')

    expect(data).toBeNull()
    expect(error).toBeInstanceOf(CraftFetchError)
    expect(error?.kind).toBe('http')
    expect(error?.status).toBe(403)
    expect(error?.statusText).toBe('Forbidden')
    expect(error?.body).toBe(htmlBody)
    expect(error?.message).toContain('403')
    expect(error?.message).not.toContain('not valid JSON')
  })

  it('classifies transport failures as network errors', async () => {
    const cause = new TypeError('fetch failed')
    vi.mocked(fetch).mockRejectedValue(cause)

    const { data, error } = await getCraftData('?elementType=entries&one=1')

    expect(data).toBeNull()
    expect(error).toBeInstanceOf(CraftFetchError)
    expect(error?.kind).toBe('network')
    expect(error?.status).toBeUndefined()
    expect(error?.cause).toBe(cause)
  })

  it('classifies a non-JSON body on a 2xx response as a parse error', async () => {
    const htmlBody = '<html><body>Maintenance</body></html>'
    vi.mocked(fetch).mockResolvedValue(new Response(htmlBody, { status: 200 }))

    const { data, error } = await getCraftData('?elementType=entries&one=1')

    expect(data).toBeNull()
    expect(error).toBeInstanceOf(CraftFetchError)
    expect(error?.kind).toBe('parse')
    expect(error?.status).toBe(200)
    expect(error?.body).toBe(htmlBody)
  })
})
