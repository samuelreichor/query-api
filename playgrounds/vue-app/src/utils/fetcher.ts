import { useCraft } from '@query-api/vue'

export async function fetchData(url: string) {
  const craftInstance = useCraft()
  const response = await fetch(url, {
    headers: {
      Authorization: craftInstance.authToken,
    },
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`)
  }

  return await response.json()
}
