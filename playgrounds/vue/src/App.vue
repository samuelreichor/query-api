<script setup lang="ts">
import { useCraft, useCraftUrlBuilder } from '@query-api/vue'
const { baseUrl, siteMap } = useCraft()
console.log(baseUrl, siteMap)

const queryEntryUrl = useCraftUrlBuilder('entries')
  .section('news')
  .fields(['title'])
  .limit(3)
  .buildUrl('all')

const queryUserUrl = useCraftUrlBuilder('users').admin().buildUrl('all')
</script>

<template>
  <main>
    <nav>
      <RouterLink to="/">Go to Home</RouterLink>
      <RouterLink to="/news-article-1">Go to News Article 1</RouterLink>
    </nav>
    <p>Entry Url{{ queryEntryUrl }}</p>
    <p>User Url{{ queryUserUrl }}</p>
    <Suspense>
      <RouterView />
    </Suspense>
  </main>
</template>
