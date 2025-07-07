import type { CraftOptions } from './types'
import { SITE_DETECTION_MODES } from '@query-api/js'

export const defaultCraftOptions: CraftOptions = {
  baseUrl: '',
  authToken: '',
  contentMapping: { pages: {}, components: {} },
  debug: false,
  enableEntryTypeMapping: true,
  siteDetectionMode: SITE_DETECTION_MODES.PATH,
  siteMap: [],
}
