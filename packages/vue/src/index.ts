import CraftPage from './components/CraftPage.vue'
import CraftArea from './components/CraftArea.vue'
import CraftNotImplemented from './components/CraftNotImplemented.vue'
import { SITE_DETECTION_MODES } from '@query-api/js'
import type { App } from 'vue'
import type { CraftCmsOptions } from './types'

export * from './composables/useCraftUrlBuilder'
export * from './composables/useApi'
export * from './types'
export * from '@query-api/js'
export { CraftPage, CraftArea, CraftNotImplemented }

export const defaultCraftOptions: CraftCmsOptions = {
  baseUrl: '',
  authToken: '',
  registerComponents: true,
  debug: false,
  enableEntryTypeMapping: true,
  siteMap: [],
  siteDetectionMode: SITE_DETECTION_MODES.PATH,
}

export const CraftCms = {
  install(app: App, options: CraftCmsOptions = defaultCraftOptions) {
    const mergedOptions: CraftCmsOptions = { ...defaultCraftOptions, ...options }

    if (mergedOptions.registerComponents) {
      app.component('CraftPage', CraftPage)
      app.component('CraftArea', CraftArea)
      app.component('CraftNotImplemented', CraftNotImplemented)
    }

    app.provide('CraftCmsOptions', mergedOptions)
  },
}
