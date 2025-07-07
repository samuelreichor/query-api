import type { CraftOptions } from '../types'
import { defaultCraftOptions } from '../constants'

// Create a holder for our instance.
// We use a holder object so we can attach it to the global scope in development
// and ensure that even with hot-reloading, we always have the same reference.
let instanceHolder: { instance: CraftOptions | null } = { instance: null }

// In development, we leverage the global scope to preserve the instance across
// module reloads, a common issue with HMR.
const g = globalThis as typeof globalThis & {
  __CRAFT_INSTANCE_HOLDER__?: typeof instanceHolder
}

if (!g.__CRAFT_INSTANCE_HOLDER__) {
  g.__CRAFT_INSTANCE_HOLDER__ = instanceHolder
}

// Always use the global holder in development. This is the key to surviving HMR.
instanceHolder = g.__CRAFT_INSTANCE_HOLDER__

/**
 * Initialize and return craft config with recommended defaults.
 */
export function craftInit(pluginOptions: CraftOptions = defaultCraftOptions) {
  instanceHolder.instance = { ...defaultCraftOptions, ...pluginOptions }
  return instanceHolder.instance
}

/**
 * Returns the Craft CMS instance that was initialized with craftInit.
 */
export function getCraftInstance() {
  if (!instanceHolder.instance) {
    throw new Error(
      'Craft CMS instance not found. Ensure `craftInit()` is called in a shared entry point like your root layout. This error can occur in development if the instance is not correctly preserved across module reloads.',
    )
  }
  return instanceHolder.instance
}

/**
 * Returns the contentMapping that was initialized with craftInit.
 */
export function getCraftContentMapping() {
  const instance = getCraftInstance()
  if (instance.contentMapping === undefined) {
    throw new Error(
      "You can't use getContentMapping if you're not loading craftInit and provide a valid contentMapping.",
    )
  }

  return instance.contentMapping
}
