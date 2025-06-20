import CraftPage from './components/CraftPage.vue'
import CraftArea from './components/CraftArea.vue'
import CraftNotImplemented from './components/CraftNotImplemented.vue'
import type { App } from 'vue'
import type { CraftCmsOptions } from './types'

export * from './composables/useCraftUrlBuilder'
export * from './composables/useApi'
export * from './types'

export { CraftPage, CraftArea, CraftNotImplemented }

export const siteDetectionModes = {
  PATH: 'path',
  ORIGIN: 'origin',
} as const

export const defaultCraftOptions: CraftCmsOptions = {
  baseUrl: '',
  authToken: '',
  registerComponents: true,
  debug: false,
  enableEntryTypeMapping: true,
  siteMap: [],
  siteDetectionMode: siteDetectionModes.PATH,
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
