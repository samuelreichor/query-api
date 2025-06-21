import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { CraftPage, getCraftInstance, useCraftUrlBuilder } from '@query-api/react'

export default function CraftRouter() {
  const { '*': params } = useParams()
  const uri = params !== '' ? params : '__home__'

  const { authToken } = getCraftInstance()
  const apiUrl = useCraftUrlBuilder('entries').uri(uri).buildUrl('one')
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!apiUrl || !authToken) return

    setLoading(true)
    setError(null)

    fetch(apiUrl, {
      headers: {
        Authorization: `${authToken}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [apiUrl])

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {data && <CraftPage content={data} />}
    </div>
  )
}
