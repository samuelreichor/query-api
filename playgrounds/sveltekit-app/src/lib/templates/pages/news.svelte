<script lang="ts">
  import { getCraftQuery, CraftMatrix, type ComponentMapping } from '@query-api/svelte'
  import ImageText from '../components/imageText.svelte'
  import Headline from '../components/headline.svelte'

  let {
    metadata,
    contentBuilder = [],
    sectionHandle,
    title,
    text = '',
    richtext = '',
    cta,
  }: {
    metadata?: object
    contentBuilder?: any[]
    sectionHandle?: string
    title?: string
    text?: string
    richtext?: string
    cta?: object
  } = $props()

  type NewsArticle = {
    title: string
  }

  const blockMapping = {
    imageText: ImageText,
    headline: Headline,
  } as unknown as ComponentMapping

  // Fetch related news - this would typically be done in +page.server.ts
  // but shown here for demonstration purposes
</script>

<div>
  <h1>{title}</h1>
  {#if contentBuilder && contentBuilder.length > 0}
    <CraftMatrix content={contentBuilder} {blockMapping} />
  {/if}

  <h2>Related News</h2>
  <p>News articles would be fetched here...</p>
</div>
