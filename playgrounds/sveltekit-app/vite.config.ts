import { sveltekit } from '@sveltejs/kit/vite'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/playgrounds/sveltekit-app',
  plugins: [sveltekit()],
  server: {
    port: 4200,
    host: 'localhost',
  },
})
