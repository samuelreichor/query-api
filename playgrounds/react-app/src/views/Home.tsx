import type { CraftPageHome } from 'common'
import { CraftArea } from '@query-api/react'

export default function Home(props: CraftPageHome) {
  return (
    <div>
      <h1>{props.title}</h1>
      <CraftArea content={props.contentBuilder} />
    </div>
  )
}
