/// <reference types='vitest' />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import * as path from 'path'

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/react',
  plugins: [
    react(),
    dts({ entryRoot: 'src', tsconfigPath: path.join(__dirname, 'tsconfig.lib.json') }),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      // Multiple entry points for the library build
      entry: {
        index: 'src/index.ts',
        core: 'src/core.ts',
        react: 'src/react.ts',
      },
      name: '@query-api/react',
      fileName: (format, entryName) => `${entryName}.js`,
      formats: ['es' as const],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-router', '@query-api/js'],
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}))
