import RelatedNews from '@/components/RelatedNews'
import { CraftArea } from '@query-api/next'
import { CraftPageHome } from 'common'

export default function Home(props: CraftPageHome) {
  return (
    <div>
      <h1>{props.title}</h1>
      <p>{props.plainText}</p>
      <CraftArea content={props.contentBuilder} />
      <RelatedNews />
    </div>
  )
}
