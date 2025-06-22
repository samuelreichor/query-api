import { CraftEntryTypeHeadline } from 'common'

export default function Headline(props: CraftEntryTypeHeadline) {
  const Tag = props.headlineTag.value
  return <Tag>{props.title}</Tag>
}
