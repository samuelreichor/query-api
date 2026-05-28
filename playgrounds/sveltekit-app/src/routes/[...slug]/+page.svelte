<script lang="ts">
  import {
    CraftNotImplemented,
    CraftPage,
    type ContentMapping,
    type PageMapping,
  } from '@query-api/svelte'
  import Home from '$lib/templates/pages/home.svelte'
  import News from '$lib/templates/pages/news.svelte'

  let { data } = $props()

  const mapping: ContentMapping = {
    pages: {
      home: Home,
      'news:home': CraftNotImplemented,
    } as PageMapping,
  }
</script>

<div>
  {#if data.entry}
    <CraftPage config={mapping} content={data.entry} />
  {:else}
    <p>No entry found</p>
  {/if}
</div>
