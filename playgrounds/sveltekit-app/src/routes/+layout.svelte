<script lang="ts">
  let { children } = $props()
</script>

<div>
  <nav>
    <a href="/">Home</a>
    <a href="/de">DE</a>
    <a href="/es">ES</a>
    <a href="/news-article-1">News Article</a>
  </nav>
  {@render children()}
</div>
