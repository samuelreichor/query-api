<script lang="ts">
  import { CraftMatrix, CraftNotImplemented, type ComponentMapping } from '@query-api/svelte'
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

  const blockMapping = {
    imageText: ImageText,
    headline: Headline,
    hyperLink: CraftNotImplemented,
    link: CraftNotImplemented,
  } as unknown as ComponentMapping
</script>

<div>
  <h1>{title}</h1>
  {#if contentBuilder && contentBuilder.length > 0}
    <CraftMatrix content={contentBuilder} {blockMapping} />
  {/if}
</div>
