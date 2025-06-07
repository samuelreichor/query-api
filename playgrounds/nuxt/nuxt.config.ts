// https://nuxt.com/docs/api/configuration/nuxt-config
import { baseConfig } from '../../common/constants'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@query-api/nuxt'],

  craftcms: baseConfig,
})
