<script lang="ts">
  let { title, headlineTag } = $props<{
    title: string
    headlineTag?: { value?: string }
  }>()

  const tag = headlineTag?.value ?? 'h2'
</script>

<svelte:element this={tag}>
  {title}
</svelte:element>
