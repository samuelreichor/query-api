# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Project Overview

Query API is a monorepo providing JavaScript/TypeScript SDKs for the Craft CMS Query API plugin. It
enables type-safe querying of Craft CMS content (entries, assets, addresses, users) from various
frontend frameworks.

## Common Commands

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests for all packages
npm run test

# Lint all packages
npm run lint

# Type check all packages
npm run typecheck

# Build/test/lint specific package
npx nx build @query-api/js
npx nx test @query-api/vue
npx nx lint @query-api/nuxt

# Run single test file
npx nx test @query-api/vue -- path/to/test.spec.ts

# Dev server for playground apps
npx nx dev nuxt-app
npx nx dev vue-app
npx nx dev react-app
npx nx dev next-app

# Format code
npm run fix:prettier

# Release (builds all packages, then runs release script)
npm run release

# Clean everything (cache, build artifacts, node_modules)
npm run clean
```

## Architecture

### Package Hierarchy

```
@query-api/js (core)
    ↓
@query-api/vue ──→ @query-api/nuxt
@query-api/react ──→ @query-api/next
@query-api/svelte
```

- **@query-api/js**: Core package with `buildCraftQueryUrl()` fluent query builder, type
  definitions, and utilities (preview mode, multisite, bearer tokens)
- **@query-api/vue**: Vue plugin with components (`CraftPage`, `CraftArea`, `CraftNotImplemented`)
  and composables (`useCraftUrlBuilder`, `useApi`)
- **@query-api/nuxt**: Nuxt module extending Vue package with auto-imports, SSR support, and caching
  options
- **@query-api/react**: React package with components and hooks (`getInstance`, `getCraftLocation`)
- **@query-api/next**: Next.js package with RSC support (separate server/client exports)
- **@query-api/svelte**: Svelte 5 package with components and runes-based state

### Key Patterns

- **Fluent Query Builder**: The core `buildCraftQueryUrl(elementType)` returns a chainable builder
  with element-specific methods (e.g., `.section()`, `.slug()` for entries)
- **Framework Wrappers**: Each framework package wraps the core logic with framework-specific
  patterns (Vue composables, React hooks, Svelte runes)
- **Component Mapping**: `CraftPage` components handle rendering different Craft entry types via a
  user-defined component map

### Build System

- Uses Nx for task orchestration with workspace packages
- Package builds depend on `^build` (dependencies build first)
- Vite for Vue/React packages, SvelteKit for Svelte, Rollup for Next.js, nuxt-module-builder for
  Nuxt
- Releases use conventional commits for versioning

### Directory Structure

```
packages/
  js/          # Core SDK - query builder, types, utilities
  vue/         # Vue 3 plugin
  nuxt/        # Nuxt 3 module
  react/       # React library
  next/        # Next.js integration
  svelte/      # Svelte 5 library
playgrounds/
  vue-app/     # Vue development playground
  nuxt-app/    # Nuxt development playground
  react-app/   # React development playground
  next-app/    # Next.js development playground
  common/      # Shared types across playgrounds
```
