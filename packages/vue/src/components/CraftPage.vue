<script lang="ts" setup>
import { inject, provide } from 'vue'
import type { ContentMapping, CraftCmsOptions } from '../types'
import type { PropType } from 'vue'

const props = defineProps({
  config: {
    type: Object as PropType<ContentMapping>,
    required: true,
  },
  content: {
    type: Object,
    required: true,
  },
})

// Framework integrations (e.g. @query-api/nuxt) can provide an error handler to
// show their own error page. Throwing only works during SSR: Nuxt removes its
// Vue error handler after hydration, so render-time throws are lost on
// client-side navigation.
const providedErrorHandler = inject<((error: Error) => void) | null>('craftPageErrorHandler', null)

function handleError(code: '404', msg: string) {
  const pageKey = `Page${code}`
  if (props.config && props.config.pages[pageKey]) {
    return props.config.pages[pageKey]
  }

  if (props.config && props.config.pages['Error']) {
    return props.config.pages['Error']
  }

  // Attach h3-compatible properties so Nitro/Nuxt responds with 404 instead of 500
  const error = new Error(msg) as Error & {
    statusCode: number
    statusMessage: string
    fatal: boolean
  }
  error.statusCode = Number(code)
  error.statusMessage = 'Page Not Found'
  error.fatal = true

  if (providedErrorHandler) {
    providedErrorHandler(error)
    return () => null
  }

  throw error
}

function getEntryTypeHandle() {
  if ('entryType' in props.content.metadata) {
    return props.content.metadata.entryType
  }
  return 'default'
}

function getCurrentPage() {
  if (!props.config || !('pages' in props.config)) {
    throw new Error('Configuration is missing pages or invalid. Check your contentMapping object.')
  }

  if (!('sectionHandle' in props.content)) {
    return handleError(
      '404',
      'Section handle not found in queried data. Check your query or prevent it by defining an Error Page.',
    )
  }

  const currentSectionHandle = props.content.sectionHandle
  const entryTypeHandle = getEntryTypeHandle()
  const { enableEntryTypeMapping } = inject<CraftCmsOptions>('CraftCmsOptions')!

  if (enableEntryTypeMapping) {
    const key = `${currentSectionHandle}:${entryTypeHandle}`
    const Page = props.config.pages[key]
    if (Page) {
      return Page
    }
  }

  const FallbackPage = props.config.pages[currentSectionHandle]
  if (FallbackPage) {
    return FallbackPage
  }

  const baseErrMsg = `No mapped page found for section handle "${currentSectionHandle}"`
  const entryTypeErrMsg = `${baseErrMsg} with entry type handle "${entryTypeHandle}"`
  return handleError('404', enableEntryTypeMapping ? `${entryTypeErrMsg}.` : `${baseErrMsg}.`)
}

provide('config', props.config)
</script>

<template>
  <div>
    <component :is="getCurrentPage()" v-bind="props.content" />
  </div>
</template>
