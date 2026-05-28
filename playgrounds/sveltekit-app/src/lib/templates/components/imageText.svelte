<script lang="ts">
  let { title, text, image } = $props<{
    title?: string
    text?: string
    image?: { url?: string; alt?: string }
  }>()
</script>

<div class="image-text">
  {#if image?.url}
    <img src={image.url} alt={image.alt ?? ''} />
  {/if}
  <div class="content">
    {#if title}
      <h3>{title}</h3>
    {/if}
    {#if text}
      <p>{text}</p>
    {/if}
  </div>
</div>

<style>
  .image-text {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
  }
  .image-text img {
    max-width: 300px;
    height: auto;
  }
</style>
