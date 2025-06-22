import { SITE_HEADERS } from '../constants'
import { PREVIEW_PARAMS } from '@query-api/js'
import { headers } from 'next/headers'
import type { NextRequest, NextResponse } from 'next/server'

/**
 * Sets Craft CMS preview parameters from the request URL as headers on the response.
 * This allows preview data to be available in server components.
 * @param res The NextResponse object to modify.
 * @param req The NextRequest object to read from.
 * @returns The modified NextResponse object.
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
 * @param res The NextResponse object to modify.
 * @param req The NextRequest object to read from.
 * @returns The modified NextResponse object.
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
 * @param res The NextResponse object to modify.
 * @param req The NextRequest object to read from.
 * @returns The modified NextResponse object.
 */
export function setCraftHeaders(res: NextResponse, req: NextRequest) {
  res = setCraftPreviewHeaders(res, req)
  res = setCraftSiteHeaders(res, req)
  return res
}

/**
 * Extracts Craft CMS preview parameters (e.g., token, x-craft-preview, x-craft-live-preview) from the request headers.
 * This is used in server components or API routes to construct preview-aware API calls.
 * @returns A record of preview parameters found in the headers.
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
 * @returns An object containing the site's origin, path, and full URL.
 */
export async function getCraftSiteHeaders() {
  const hdrs = await headers()
  return {
    origin: hdrs.get(SITE_HEADERS.ORIGIN),
    path: hdrs.get(SITE_HEADERS.PATH),
    url: hdrs.get(SITE_HEADERS.URL),
  }
}
