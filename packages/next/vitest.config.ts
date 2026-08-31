/// <reference types='vitest' />
import { defineConfig } from 'vite'
import * as path from 'node:path'

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/next',
  resolve: {
    alias: {
      // Resolve workspace packages from source so tests don't depend on built dists.
      '@query-api/js': path.join(__dirname, '../js/src/index.ts'),
      '@query-api/react/core': path.join(__dirname, '../react/src/core.ts'),
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'node',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}))
