import type { DefineComponent } from 'vue'
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
      [key: string]: Record<string, DefineComponent>
    } & {
      Page404?: Record<string, DefineComponent>
      Error?: Record<string, DefineComponent>
    }
  >
  components: {
    [key: string]: Record<string, DefineComponent>
  }
}

/**
 * @deprecated Please use ContentMapping instead. Will be removed in the next major version.
 */
export type Config = ContentMapping

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
  registerComponents?: boolean
  debug?: boolean
  enableEntryTypeMapping?: boolean
  siteMap?: CraftSites
  siteDetectionMode?: SiteDetectionMode
}

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
