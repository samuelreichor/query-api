import { CraftCms, type CraftCmsOptions } from '@query-api/vue'
import { defineNuxtPlugin, useRuntimeConfig, showError } from 'nuxt/app'
import type { NuxtError } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  const { craftcms } = useRuntimeConfig().public
  nuxtApp.vueApp.use(CraftCms, { ...(craftcms as CraftCmsOptions) })

  // Let CraftPage trigger the Nuxt error page via showError instead of throwing,
  // so 404s also work on client-side navigation (see CraftPage handleError)
  nuxtApp.vueApp.provide('craftPageErrorHandler', (error: Partial<NuxtError>) => {
    showError(error)
  })
})
