import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { defineNuxtConfig } from 'nuxt/config'
import { baseConfig } from 'common'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: 'src',
  devtools: { enabled: true },
  devServer: {
    host: 'localhost',
    port: 4200,
  },
  typescript: {
    typeCheck: true,
    tsConfig: {
      extends: '../tsconfig.app.json',
    },
  },
  imports: {
    autoImport: false,
  },
  vite: {
    plugins: [nxViteTsPaths()],
  },

  modules: ['@query-api/nuxt'],

  craftcms: {
    ...baseConfig,
    caching: false,
  },
})
