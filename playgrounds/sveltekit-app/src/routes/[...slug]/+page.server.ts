import { getCraftEntry, getCraftUri, getCraftCurrentSite } from '@query-api/svelte'

export async function load() {
  const uri = getCraftUri()
  const currentSite = getCraftCurrentSite()

  console.log('URI:', uri)
  console.log('Current Site:', currentSite)

  const data = await getCraftEntry().uri(uri).site(currentSite.handle).includeFullEntry(true).one()

  return {
    entry: data,
  }
}
