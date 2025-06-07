<script setup lang="ts">
import { useCraftUrlBuilder, useCraft } from '@query-api/vue'
import { useFetch } from '../composables/useFetch'
import { ref } from 'vue'

const props = defineProps({
  metadata: {
    type: Object,
    required: true,
  },
  contentBuilder: {
    type: Object,
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

const queryEntryUrl = useCraftUrlBuilder('entries')
  .section('news')
  .fields(['title'])
  .limit(3)
  .buildUrl('all')

const { authToken } = useCraft()
type News = {
  title: string
}
const { data } = useFetch<News[]>(queryEntryUrl, authToken)
</script>

<template>
  <div>
    <h1>{{ props.title }}</h1>
    <CraftArea v-if="props.contentBuilder" :content="props.contentBuilder" />

    <h2>Related News</h2>
    <ul>
      <li v-for="news in data">{{ news.title }}</li>
    </ul>
  </div>
</template>
