import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { setCraftPreviewHeaders, setCraftSiteHeaders } from '@query-api/next'

export function middleware(req: NextRequest) {
  let res = NextResponse.next()
  res = setCraftPreviewHeaders(res, req)
  res = setCraftSiteHeaders(res, req)

  // You can also use the `setCraftHeaders` function if you want to set both preview and site headers in one go
  // res = setCraftHeaders(res, req)
  return res
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
