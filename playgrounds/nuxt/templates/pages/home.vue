<script setup lang="ts">
import { CraftArea } from '@query-api/vue'
import { useCraftQuery } from '#imports'

const props = defineProps({
  metadata: {
    type: Object,
    required: true,
  },
  contentBuilder: {
    type: Array,
    required: true,
  },
  sectionHandle: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: () => '',
  },
  richtext: {
    type: String,
    default: () => '',
  },
  cta: {
    type: Object,
    default: () => undefined,
  },
})

type NewsArticle = {
  title: string
}

const { data, error } = await useCraftQuery('entries')
  .section('news')
  .fields(['title'])
  .siteId([1, 2, 3])
  .all()

if (error.value) {
  console.error(error.value)
}
</script>

<template>
  <div>
    <h1>{{ props.title }}</h1>
    <CraftArea v-if="props.contentBuilder" :content="props.contentBuilder" />

    <h2>Related News</h2>
    <ul>
      <li v-for="(news, index) in data as NewsArticle[]" :key="index">
        {{ news.title }}
      </li>
    </ul>
  </div>
</template>
