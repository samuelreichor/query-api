import { buildCraftQueryUrl } from '@query-api/js'
import { getCraftInstance } from './getInstance'
import type { ElementType, ExecutionMethod } from '@query-api/js'

/**
 * Creates urls for Craft CMS queries based on the provided element type.
 *
 * Only usable within a React components
 */
export function createCraftUrl<T extends ElementType>(elementType: T) {
  const queryBuilder = buildCraftQueryUrl(elementType)
  const { baseUrl, debug } = getCraftInstance()

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
