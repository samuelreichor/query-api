/// <reference types='vitest' />
import { defineConfig, type Plugin } from 'vitest/config'
import dts from 'vite-plugin-dts'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import * as path from 'path'

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/svelte',
  plugins: [
    svelte(),
    dts({ entryRoot: 'src', tsconfigPath: path.join(__dirname, 'tsconfig.lib.json') }),
  ] as Plugin[],
  build: {
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      // Multiple entry points for the library build
      entry: {
        index: 'src/index.ts',
      },
      name: '@query-api/svelte',
      fileName: (format, entryName) => `${entryName}.js`,
      formats: ['es' as const],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: ['svelte', '@query-api/js'],
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    expect: { requireAssertions: true },
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx,svelte}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
})
