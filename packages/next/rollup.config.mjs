import typescript from '@rollup/plugin-typescript'
import pkg from './package.json' with { type: 'json' }
import preserveDirectives from 'rollup-plugin-preserve-directives'

export default {
  input: {
    client: 'src/client.ts',
    server: 'src/server.ts',
  },

  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
    entryFileNames: '[name].js',
    preserveModules: true,
  },

  // Hier werden die externen Pakete deklariert
  external: [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies),
    'react/jsx-runtime',
    '@query-api/js',
    '@query-api/react',
    'next/server',
    'next/headers',
    '@query-api/react/core',
    '@query-api/react/react',
  ],

  plugins: [
    preserveDirectives(),
    typescript({
      tsconfig: './tsconfig.lib.json',
      declaration: true,
      declarationDir: 'dist',
    }),
  ],
}
