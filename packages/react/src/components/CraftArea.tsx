import type { ContentMapping } from '../types'
import { useContentMapping } from '../composables/useApi'

function getCurrentComponent(cData: object, contentMapping: ContentMapping) {
  if (!contentMapping || !('components' in contentMapping)) {
    throw new Error(
      'Configuration is missing the "components" property or is invalid. Check your config object',
    )
  }

  if (!('type' in cData) || typeof cData.type !== 'string') {
    throw new Error('Provided data has no valid type set. Check your queried data.')
  }

  const ComponentEl = contentMapping.components[cData.type]

  if (!ComponentEl) {
    console.error(`No mapped component found for component type: ${cData.type}`)
  }

  return ComponentEl
}

type Props = {
  content: Array<object> | null
}

const CraftArea: React.FC<Props> = ({ content }) => {
  const contentMapping = useContentMapping()
  if (!content) return
  const elements: React.ReactNode[] = []

  for (let i = 0; i < content.length; i++) {
    const cData = content[i]
    const Component = getCurrentComponent(cData, contentMapping)
    if (!Component) continue
    elements.push(<Component key={i} {...cData} />)
  }

  return <div>{elements}</div>
}

export default CraftArea
