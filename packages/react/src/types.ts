import type React from 'react'
import { siteDetectionModes } from './index'

export type CraftPageEntry = {
  metadata: { entryType?: string }
  sectionHandle?: string
  [key: string]: unknown
}

export type CraftAreaComponent = {
  type: string
  [key: string]: unknown
}

export type ContentMapping = {
  pages: Prettify<
    {
      [key: string]: React.ElementType
    } & {
      page404?: React.ElementType
      error?: React.ElementType
    }
  >
  components: {
    [key: string]: React.ElementType
  }
}

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

export type SiteDetectionMode = (typeof siteDetectionModes)[keyof typeof siteDetectionModes]

export type CraftCmsOptions = {
  baseUrl: string
  authToken: string
  contentMapping: ContentMapping
  debug?: boolean
  enableEntryTypeMapping?: boolean
  siteMap?: CraftSites
  siteDetectionMode?: SiteDetectionMode
}

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
