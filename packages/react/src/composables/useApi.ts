import type { CraftCmsOptions } from '../types'
import { defaultCraftOptions } from '../index'

let craftcmsInstance: CraftCmsOptions | null = null

export function craftInit(pluginOptions: CraftCmsOptions = defaultCraftOptions) {
  craftcmsInstance = { ...defaultCraftOptions, ...pluginOptions }
}

export function getCraftInstance() {
  if (!craftcmsInstance) {
    throw new Error("You can't use getCraftInstance if you're not loading craftInit.")
  }

  return craftcmsInstance
}

export function getContentMapping() {
  if (!craftcmsInstance || craftcmsInstance.contentMapping === undefined) {
    throw new Error(
      "You can't use getContentMapping if you're not loading craftInit and provide a valid contentMapping.",
    )
  }

  return craftcmsInstance.contentMapping
}
