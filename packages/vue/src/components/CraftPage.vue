<script lang="ts" setup>
import { inject, provide } from 'vue'
import type { Config, CraftCmsOptions } from '../types'
import type { PropType } from 'vue'

const props = defineProps({
  config: {
    type: Object as PropType<Config>,
    required: true,
  },
  content: {
    type: Object,
    required: true,
  },
})

function handleError(code: '404', msg: string) {
  const pageKey = `Page${code}`
  if (props.config && props.config.pages[pageKey]) {
    return props.config.pages[pageKey]
  }

  if (props.config && props.config.pages['Error']) {
    return props.config.pages['Error']
  }

  throw new Error(msg)
}

function getEntryTypeHandle() {
  if ('entryType' in props.content.metadata) {
    return props.content.metadata.entryType
  }
  return 'default'
}

function getCurrentPage() {
  if (!props.config || !('pages' in props.config)) {
    throw new Error('Configuration is missing pages or invalid. Check your config object.')
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

  if (
    currentSectionHandle !== entryTypeHandle &&
    entryTypeHandle !== 'default' &&
    enableEntryTypeMapping
  ) {
    const pageComponent = props.config.pages[`${currentSectionHandle}:${entryTypeHandle}`]

    if (!pageComponent) {
      console.error(
        `No mapped Page found for section handle "${currentSectionHandle}" with entrytype handle "${entryTypeHandle}". `,
      )
    }
    return pageComponent
  }

  const pageComponent = props.config.pages[currentSectionHandle]

  if (!pageComponent) {
    console.error(`No mapped Page found for section handle: ${currentSectionHandle}`)
  }

  return pageComponent
}

provide('config', props.config)
</script>

<template>
  <div>
    <component :is="getCurrentPage()" v-bind="props.content" />
  </div>
</template>
