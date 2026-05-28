import type { SiteDetectionMode, CraftSites, Prettify } from '@query-api/js'
import type { Component } from 'svelte'

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

export type PageMapping = Prettify<
  {
    [key: string]: Component
  } & {
    Page404?: Component
    Error?: Component
  }
>

export type ComponentMapping = {
  [key: string]: Component
}

export type ContentMapping = {
  pages: PageMapping
  components?: ComponentMapping
}

export type RequestEventLike = {
  url: URL
}

export type GetRequestEventFn = () => RequestEventLike | undefined

export type CraftOptions = {
  baseUrl: string
  authToken: string
  contentMapping?: ContentMapping
  debug?: boolean
  enableEntryTypeMapping?: boolean
  siteMap?: CraftSites
  siteDetectionMode?: SiteDetectionMode
  getRequestEvent?: GetRequestEventFn
}
