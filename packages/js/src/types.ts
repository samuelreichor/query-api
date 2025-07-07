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
