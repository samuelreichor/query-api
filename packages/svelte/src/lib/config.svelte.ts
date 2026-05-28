import type { CraftOptions } from './types'
import { defaultCraftOptions } from './constants'

let _config = $state<CraftOptions>(defaultCraftOptions)

export function initQueryApi(opts: Partial<CraftOptions>) {
  _config = { ..._config, ...opts }
}

export function getQueryApiConfig(): CraftOptions {
  return _config
}
