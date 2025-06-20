<script setup lang="ts">
import { useCraftUrlBuilder } from '@query-api/vue'
import { fetchData } from '../utils/fetcher'
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

const data = ref(await fetchData(queryEntryUrl))
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
