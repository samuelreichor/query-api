import { setCraftHeaders } from '@query-api/next/server'
import { NextRequest, NextResponse } from 'next/server'

/*   export default createQueryApiMiddleware() */

export default function middleware(req: NextRequest) {
  let res = NextResponse.next()
  res = setCraftHeaders(res, req)
  return res
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
