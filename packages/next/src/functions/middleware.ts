import { SITE_HEADERS } from '../constants'
import { PREVIEW_PARAMS } from '@query-api/js'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Sets Craft CMS preview parameters from the request URL as headers on the response.
 * This allows preview data to be available in server components.
 */
export function setCraftPreviewHeaders(res: NextResponse, req: NextRequest) {
  const previewParams = PREVIEW_PARAMS
  const { searchParams } = req.nextUrl

  for (const param of previewParams) {
    const value = searchParams.get(param)
    if (value) {
      res.headers.set(param, value)
    }
  }

  return res
}

/**
 * Sets site-related information (url, origin, path) from the request as headers on the response.
 * This makes the original request URL available in server components.
 */
export function setCraftSiteHeaders(res: NextResponse, req: NextRequest) {
  const fullUrl = req.nextUrl.href
  const origin = req.nextUrl.origin
  const path = req.nextUrl.pathname
  res.headers.set(SITE_HEADERS.URL, fullUrl)
  res.headers.set(SITE_HEADERS.ORIGIN, origin)
  res.headers.set(SITE_HEADERS.PATH, path)
  return res
}

/**
 * A convenience function that sets both preview and site headers.
 */
export function setCraftHeaders(res: NextResponse, req: NextRequest) {
  res = setCraftPreviewHeaders(res, req)
  res = setCraftSiteHeaders(res, req)
  return res
}

/**
 * Extracts Craft CMS preview parameters (e.g., token, x-craft-preview, x-craft-live-preview) from the request headers.
 * This is used in server components or API routes to construct preview-aware API calls.
 */
export async function getCraftPreviewHeaders() {
  const hdrs = await headers()
  const params: Record<string, string> = {}
  for (const param of PREVIEW_PARAMS) {
    const value = hdrs.get(param)
    if (value) {
      params[param] = value
    }
  }
  return params
}

/**
 * Extracts site-related information (e.g., url, origin, path) from the request headers.
 * This is useful for determining the current site context in server-side logic.
 */
export async function getCraftSiteHeaders() {
  const hdrs = await headers()
  return {
    origin: hdrs.get(SITE_HEADERS.ORIGIN),
    path: hdrs.get(SITE_HEADERS.PATH),
    url: hdrs.get(SITE_HEADERS.URL),
  }
}

/**
 * Factory function to create a Next.js middleware that sets Craft CMS preview and site headers
 * on the response. This enables server components and API routes to access Craft-specific
 * request context via headers.
 */
export function createQueryApiMiddleware() {
  return function middleware(req: NextRequest) {
    let res = NextResponse.next()
    res = setCraftHeaders(res, req)
    return res
  }
}
