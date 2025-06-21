import CraftArea from './components/CraftArea'
import CraftPage from './components/CraftPage'
import CraftNotImplemented from './components/CraftNotImplemented'
import type { CraftCmsOptions } from './types'

export { CraftArea, CraftPage, CraftNotImplemented }
export * from './composables/useApi'
export * from './composables/useCraftUrlBuilder'
export * from './types'

export const siteDetectionModes = {
  PATH: 'path',
  ORIGIN: 'origin',
} as const

export const defaultCraftOptions: CraftCmsOptions = {
  baseUrl: '',
  authToken: '',
  contentMapping: { pages: {}, components: {} },
  debug: false,
  enableEntryTypeMapping: true,
  siteDetectionMode: siteDetectionModes.PATH,
  siteMap: [],
}
