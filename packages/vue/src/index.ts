import CraftPage from './components/CraftPage.vue'
import CraftArea from './components/CraftArea.vue'
import CraftNotImplemented from './components/CraftNotImplemented.vue'
import type { App } from 'vue'
import type { CraftCmsOptions } from './types'

export * from './composables/useCraftUrlBuilder'
export * from './composables/useApi'
export * from './types'

export { CraftPage, CraftArea, CraftNotImplemented }

export const siteDetectionMode = {
  PATH: 'path',
  ORIGIN: 'origin',
} as const

export const defaultOptions: CraftCmsOptions = {
  baseUrl: '',
  authToken: '',
  registerComponents: true,
  debug: false,
  enableEntryTypeMapping: true,
  siteMap: [],
  siteDetectionMode: siteDetectionMode.PATH,
}

export const CraftCms = {
  install(app: App, options: CraftCmsOptions = defaultOptions) {
    const mergedOptions: CraftCmsOptions = { ...defaultOptions, ...options }

    if (mergedOptions.registerComponents) {
      app.component('CraftPage', CraftPage)
      app.component('CraftArea', CraftArea)
      app.component('CraftNotImplemented', CraftNotImplemented)
    }

    app.provide('CraftCmsOptions', mergedOptions)
  },
}
