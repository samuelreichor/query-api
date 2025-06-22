import CraftArea from './components/CraftArea'
import CraftPage from './components/CraftPage'
import CraftNotImplemented from './components/CraftNotImplemented'
import type { CraftOptions } from './types'

export { CraftArea, CraftPage, CraftNotImplemented }
export * from './functions/getInstance'
export * from './functions/createCraftUrl'
export * from './types'

export const siteDetectionModes = {
  PATH: 'path',
  ORIGIN: 'origin',
} as const

export const defaultCraftOptions: CraftOptions = {
  baseUrl: '',
  authToken: '',
  contentMapping: { pages: {}, components: {} },
  debug: false,
  enableEntryTypeMapping: true,
  siteDetectionMode: siteDetectionModes.PATH,
  siteMap: [],
}
