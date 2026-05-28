<script lang="ts">
  import { getQueryApiConfig } from '../config.svelte'
  import type { ContentMapping } from '../types'
  import { setContext } from 'svelte'

  const { config, content } = $props<{
    config: ContentMapping
    content: any
  }>()

  const { enableEntryTypeMapping = false } = getQueryApiConfig()

  setContext('config', config)

  function handleError(code: '404', msg: string) {
    const pageKey = `Page${code}`
    if (config && config.pages[pageKey]) return config.pages[pageKey]
    if (config && config.pages['Error']) return config.pages['Error']
    throw new Error(msg)
  }

  function getEntryTypeHandle() {
    if (content?.metadata && 'entryType' in content.metadata) {
      return content.metadata.entryType
    }
    return 'default'
  }

  const CurrentPage = $derived.by(() => {
    if (!config || !('pages' in config)) {
      throw new Error(
        'Configuration is missing pages or invalid. Check your contentMapping object.',
      )
    }

    if (!('sectionHandle' in (content ?? {}))) {
      return handleError(
        '404',
        'Section handle not found in queried data. Check your query or define an Error Page.',
      )
    }

    const currentSectionHandle = content.sectionHandle
    const entryTypeHandle = getEntryTypeHandle()

    if (enableEntryTypeMapping) {
      const key = `${currentSectionHandle}:${entryTypeHandle}`
      const PageByEntryType = config.pages[key]
      if (PageByEntryType) return PageByEntryType
    }

    const FallbackPage = config.pages[currentSectionHandle]
    if (FallbackPage) return FallbackPage

    const baseErrMsg = `No mapped page found for section handle "${currentSectionHandle}"`
    const entryTypeErrMsg = `${baseErrMsg} with entry type handle "${entryTypeHandle}"`

    return handleError('404', enableEntryTypeMapping ? `${entryTypeErrMsg}.` : `${baseErrMsg}.`)
  })
</script>

<div>
  {#if CurrentPage}
    <CurrentPage {...content} />
  {/if}
</div>
