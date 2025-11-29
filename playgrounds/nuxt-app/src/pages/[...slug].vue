<script setup lang="ts">
import type { ContentMapping } from '@query-api/nuxt'
import { CraftPage } from '@query-api/vue'
import Home from '../templates/pages/home.vue'
import News from '../templates/pages/news.vue'

import {
  useCraftCurrentSite,
  useCraftUri,
  useCraftEntry,
  useCraftQuery,
  useCraftAsset,
  useCraftSeoMatic,
  computed,
  useHead,
} from '../../.nuxt/imports'

const mapping: ContentMapping = {
  pages: {
    home: Home,
    'news:home': News,
  },
}

const uri = useCraftUri()
console.log(uri.value)

const currentSite = useCraftCurrentSite()
console.log(currentSite.value)

const url = useCraftEntry().id(1).buildUrl('all')
console.log(url)

type BaseResT = {
  metadata: object
}

// Check for ts errors
const { data: craftEntry1 } = useCraftEntry().uri(uri.value).site(currentSite.value.handle).one()
const { data: craftEntry2 } = useCraftEntry<BaseResT>()
  .uri(uri.value)
  .site(currentSite.value.handle)
  .one()
const { data: craftAsset1 } = useCraftAsset().volume('images').one()
const { data: craftAsset2 } = useCraftAsset<BaseResT>().volume('images').one()
const { data: craftEntryQuery1 } = useCraftQuery('entries')
  .uri(uri.value)
  .site(currentSite.value.handle)
  .one()
const { data: craftEntryQuery2 } = useCraftQuery<BaseResT, 'entries'>('entries')
  .uri(uri.value)
  .site(currentSite.value.handle)
  .one()
const { data: craftAssetQuery1 } = useCraftAsset().volume('images').one()
const { data: craftAssetQuery2 } = useCraftQuery<BaseResT, 'assets'>('assets')
  .volume('images')
  .one()

console.debug(
  craftEntry1.value,
  craftEntry2.value?.metadata,
  craftAsset1.value,
  craftAsset2.value?.metadata,
  craftEntryQuery1.value,
  craftEntryQuery2.value?.metadata,
  craftAssetQuery1.value,
  craftAssetQuery2.value?.metadata,
)

const { data, error } = useCraftQuery<BaseResT, 'entries'>('entries')
  .uri(uri.value)
  .site(currentSite.value.handle)
  .includeFullEntry(true)
  .one()

if (error.value) {
  console.error(error.value)
}
const { data: seoData } = useCraftSeoMatic()

const title = computed(() => seoData.value?.title ?? '')
useHead({
  title,
})
</script>

<template>
  <div>
    <CraftPage v-if="data" :config="mapping" :content="data" />
  </div>
</template>
