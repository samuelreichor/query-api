<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  useCraftUrlBuilder,
  CraftNotImplemented,
  useCraft,
  type ContentMapping,
} from '@query-api/vue'
import { useCraftFetch } from './composables/useCraftFetch'

import Home from './views/home.vue'
import News from './views/news.vue'
import Headline from './components/headline.vue'

const mapping: ContentMapping = {
  pages: {
    home: Home,
    'news:home': News,
  },
  components: {
    headline: Headline,
    imageText: CraftNotImplemented,
  },
}

const route = useRoute()
const { authToken } = useCraft()
const urlBuilder = useCraftUrlBuilder('entries')
const uri = computed(() => route.params.pathMatch || '__home__')
const queryUrl = computed(() => urlBuilder.uri(uri.value).buildUrl('one'))
const { data, loading, error } = useCraftFetch(queryUrl, authToken)
</script>

<template>
  <div v-if="loading">Loading…</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>
    <CraftPage :config="mapping" :content="data" />
  </div>
</template>
