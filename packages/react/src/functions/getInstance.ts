import type { CraftOptions } from '../types'
import { defaultCraftOptions } from '../index'

let craftcmsInstance: CraftOptions | null = null

export function craftInit(pluginOptions: CraftOptions = defaultCraftOptions) {
  craftcmsInstance = { ...defaultCraftOptions, ...pluginOptions }
}

/**
 * Returns the Craft CMS instance that was initialized with craftInit.
 *
 * Only usable within a React components
 */
export function getCraftInstance() {
  if (!craftcmsInstance) {
    throw new Error("You can't use getCraftInstance if you're not loading craftInit.")
  }

  return craftcmsInstance
}

/**
 * Returns the contentMapping that was initialized with craftInit.
 *
 * Only usable within a React components
 */
export function getCraftContentMapping() {
  if (!craftcmsInstance || craftcmsInstance.contentMapping === undefined) {
    throw new Error(
      "You can't use getContentMapping if you're not loading craftInit and provide a valid contentMapping.",
    )
  }

  return craftcmsInstance.contentMapping
}
