import { buildCraftQueryUrl } from '@query-api/js'
import { useCraft } from './useApi'
import type { ElementType, ExecutionMethod } from '@query-api/js'

export function useCraftUrlBuilder<T extends ElementType>(elementType: T) {
  const queryBuilder = buildCraftQueryUrl(elementType)
  const { baseUrl, debug } = useCraft()

  return {
    ...queryBuilder,

    buildUrl(execOpt: ExecutionMethod) {
      const queryUrl = queryBuilder.buildBaseUrl(execOpt)
      const url = `${baseUrl}${queryUrl}`

      if (debug) {
        console.log('The built url is: ' + url)
      }
      return url
    },
  }
}
