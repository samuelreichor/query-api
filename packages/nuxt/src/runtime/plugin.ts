import { CraftCms, type CraftCmsOptions } from '@query-api/vue'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const { craftcms } = useRuntimeConfig().public
  nuxtApp.vueApp.use(CraftCms, { ...craftcms as CraftCmsOptions })
})
