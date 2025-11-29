import svelte from 'eslint-plugin-svelte'
import baseConfig from '../../eslint.config.mjs'
import svelteParser from 'svelte-eslint-parser'
import tsParser from '@typescript-eslint/parser'

export default [
  ...baseConfig,
  {
    ignores: ['.svelte-kit/**', 'dist/**', 'node_modules/**', '.nx/**'],
  },
  ...svelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.svelte'],
      },
    },
  },
  {
    // Override or add rules here
    rules: {},
  },
]
