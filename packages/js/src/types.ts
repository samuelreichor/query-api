import { SITE_DETECTION_MODES } from './constants'

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type CraftSite = {
  handle: string
  origin: string
  path: string
  id?: number
  label?: string
  lang?: string
  primary?: boolean
}

export type CraftSites = CraftSite[]

export type SiteDetectionMode = (typeof SITE_DETECTION_MODES)[keyof typeof SITE_DETECTION_MODES]

/* Related To Types */
export type ElementId = number

export type BaseComplexRelationObject = {
  field?: string | string[]
  sourceSite?: string | number | null
}

export type ComplexRelationObject = BaseComplexRelationObject &
  (
    | { element: number | number[]; sourceElement?: never; targetElement?: never }
    | { element?: never; sourceElement: number | number[]; targetElement?: never }
    | { element?: never; sourceElement?: never; targetElement: number | number[] }
  )

export type RelatedToParam =
  | ElementId
  | ComplexRelationObject
  | (string | ElementId | (ElementId | string)[] | ComplexRelationObject)[]

/* Internal Related To Types */
export type ShortenedComplexRelationObject = {
  sS?: string | number | number[] | null // sourceSite
  tE?: number | number[] // targetElement
  sE?: number | number[] // sourceElement
  e?: number | number[] // element
  f?: string | string[] // field
}

export type ShortenedRelatedToParam =
  | ElementId
  | ShortenedComplexRelationObject
  | (string | ElementId | (ElementId | string)[] | ShortenedComplexRelationObject)[]
