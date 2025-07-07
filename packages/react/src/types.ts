import type React from 'react'
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

export type HandledErrorCodes = '404' | '500'

export type ContentMapping = {
  pages: Prettify<
    {
      [key: string]: React.ElementType
    } & {
      [K in `page${HandledErrorCodes}`]?: React.ElementType
    } & {
      error?: React.ElementType
    }
  >
  components: {
    [key: string]: React.ElementType
  }
}

export type CraftOptions = {
  baseUrl: string
  authToken: string
  contentMapping?: ContentMapping
  debug?: boolean
  enableEntryTypeMapping?: boolean
  siteMap?: CraftSites
  siteDetectionMode?: SiteDetectionMode
}
