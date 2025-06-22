import { getCraftUri, getCraftCurrentSite, getCraftEntry, CraftPage } from '@query-api/next/server'
import { CraftPageBase } from 'common'

export default async function CraftCmsPage() {
  const uri = await getCraftUri()
  const { id } = await getCraftCurrentSite()
  const { data, error } = await getCraftEntry<CraftPageBase>().uri(uri).siteId(id).one()

  if (error || !data) {
    throw new Error(error?.message || 'No data returned from Craft API')
  }

  return <CraftPage content={data} />
}
