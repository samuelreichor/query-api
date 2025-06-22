import { getCraftSiteHeaders } from '@query-api/next'

export default async function CatchAll() {
  const siteHeaders = await getCraftSiteHeaders()
  return <div>{JSON.stringify(siteHeaders)}</div>
}
