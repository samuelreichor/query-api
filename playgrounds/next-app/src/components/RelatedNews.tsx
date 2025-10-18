'use client'

import { useCraftEntry, useCraftCurrentSite } from '@query-api/next'

export default function RelatedNews() {
  const { id } = useCraftCurrentSite()
  const { data, loading, error } = useCraftEntry().id([431, 1527, 331, 383]).siteId(id).all()

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
