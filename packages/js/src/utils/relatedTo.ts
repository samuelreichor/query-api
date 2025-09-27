import { RelatedToParam, ShortenedComplexRelationObject, ShortenedRelatedToParam } from '../types'

export function shortenRelationParam(param: RelatedToParam): ShortenedRelatedToParam {
  if (typeof param === 'number') {
    return param
  }

  // Case: It's an array (e.g., [1, 2], ['and', 1, 2], or with objects)
  if (Array.isArray(param)) {
    const firstItem = param[0]

    // Check if the first item is a known operator string
    if (typeof firstItem === 'string' && ['and', 'or', 'not'].includes(firstItem)) {
      const operator = firstItem
      const values = param.slice(1) // Get all other items

      // Keep the operator and shorten only the values
      return [
        operator,
        ...values.map((item) => shortenRelationParam(item as RelatedToParam)),
      ] as ShortenedRelatedToParam
    }

    // This part now only runs for simple arrays like [1, 2, { tE: 3 }]
    return param.map((item) =>
      shortenRelationParam(item as RelatedToParam),
    ) as ShortenedRelatedToParam
  }

  // Case: It's an object (a ComplexRelationObject)
  if (typeof param === 'object' && param !== null) {
    const shortObj: ShortenedComplexRelationObject = {}

    // Map the long keys to their short equivalents.
    if ('sourceSite' in param && param.sourceSite !== undefined) {
      shortObj.sS = param.sourceSite
    }
    if ('targetElement' in param && param.targetElement !== undefined) {
      shortObj.tE = param.targetElement
    }
    if ('sourceElement' in param && param.sourceElement !== undefined) {
      shortObj.sE = param.sourceElement
    }
    if ('element' in param && param.element !== undefined) {
      shortObj.e = param.element
    }
    if ('field' in param && param.field !== undefined) {
      shortObj.f = param.field
    }

    return shortObj
  }

  throw new Error('RelatedTo validation failed. Please check your relatedTo() input.')
}
