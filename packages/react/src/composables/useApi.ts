import type { CraftOptions } from '../types'
import { defaultCraftOptions } from '../index'

let craftcmsInstance: CraftOptions | null = null

export function craftInit(pluginOptions: CraftOptions = defaultCraftOptions) {
  craftcmsInstance = { ...defaultCraftOptions, ...pluginOptions }
}

export function useCraftInstance() {
  if (!craftcmsInstance) {
    throw new Error("You can't use getCraftInstance if you're not loading craftInit.")
  }

  return craftcmsInstance
}

export function useCraftContentMapping() {
  if (!craftcmsInstance || craftcmsInstance.contentMapping === undefined) {
    throw new Error(
      "You can't use getContentMapping if you're not loading craftInit and provide a valid contentMapping.",
    )
  }

  return craftcmsInstance.contentMapping
}
