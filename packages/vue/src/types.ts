import type { DefineComponent } from 'vue'
import { siteDetectionMode } from './index'

export type Config = {
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

export type CraftCmsOptions = {
  baseUrl: string
  authToken: string
  registerComponents?: boolean
  debug?: boolean
  enableEntryTypeMapping?: boolean
  siteMap?: CraftSites
  siteDetectionMode?: SiteDetectionMode
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

export type CraftAreaComponent = {
  knownKey: string
  [key: string]: unknown
}

export type SiteDetectionMode = (typeof siteDetectionMode)[keyof typeof siteDetectionMode]

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
