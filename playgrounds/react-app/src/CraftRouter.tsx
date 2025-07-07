import { CraftPage, useCraftCurrentSite, useCraftUri, useCraftEntry } from '@query-api/react'
import { CraftPageBase } from 'common'

export default function CraftRouter() {
  const uri = useCraftUri()
  const { id: siteId } = useCraftCurrentSite()
  const { data, error, loading } = useCraftEntry<CraftPageBase>().siteId(siteId).uri(uri).one()
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return <div>{data && <CraftPage content={data} />}</div>
}
