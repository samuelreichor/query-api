import type { DefineComponent } from 'vue'
import type { SiteDetectionMode, CraftSites, Prettify } from '@query-api/js'

export type CraftPageEntry = {
  metadata: { entryType?: string }
  sectionHandle?: string
  [key: string]: unknown
}

export type CraftAreaComponent = {
  type: string
  [key: string]: unknown
}

export type PageMapping = Prettify<
  {
    [key: string]: Record<string, DefineComponent>
  } & {
    Page404?: Record<string, DefineComponent>
    Error?: Record<string, DefineComponent>
  }
>

export type ComponentMapping = {
  [key: string]: Record<string, DefineComponent>
}

export type ContentMapping = {
  pages: PageMapping
  components?: ComponentMapping
}

/**
 * @deprecated Please use ContentMapping instead. Will be removed in the next major version.
 */
export type Config = ContentMapping

export type CraftCmsOptions = {
  baseUrl: string
  authToken: string
  registerComponents?: boolean
  debug?: boolean
  enableEntryTypeMapping?: boolean
  siteMap?: CraftSites
  siteDetectionMode?: SiteDetectionMode
}
