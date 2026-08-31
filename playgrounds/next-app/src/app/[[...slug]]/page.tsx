import { notFound } from 'next/navigation'
import { getCraftUri, getCraftCurrentSite, getCraftEntry, CraftPage } from '@query-api/next/server'
import { CraftPageBase } from 'common'

export default async function CraftCmsPage() {
  const uri = await getCraftUri()
  const { id } = await getCraftCurrentSite()
  const { data, error } = await getCraftEntry<CraftPageBase>().uri(uri).siteId(id).one()

  if (error?.status === 404) {
    notFound()
  }

  if (error) {
    throw new Error(error.message)
  }

  // one() returns null (or [] on older plugin versions) when no entry matches
  if (!data || (Array.isArray(data) && data.length === 0)) {
    notFound()
  }

  return <CraftPage content={data} />
}
