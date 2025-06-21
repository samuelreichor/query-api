<script setup lang="ts">
import type { ContentMapping } from '@query-api/vue'
import { CraftPage } from '@query-api/vue'
import Home from '../templates/pages/home.vue'
import News from '../templates/pages/news.vue'
import ImageText from '../templates/components/imageText.vue'
import Headline from '../templates/components/headline.vue'
import {
  useCraftCurrentSite,
  useCraftUri,
  useCraftEntry,
  useCraftQuery,
  useCraftAsset,
} from '../../.nuxt/imports'

const mapping: ContentMapping = {
  pages: {
    home: Home,
    'news:home': News,
  },
  components: {
    imageText: ImageText,
    headline: Headline,
  },
}

const uri = useCraftUri()
console.log(uri.value)

const currentSite = useCraftCurrentSite()
console.log(currentSite.value)

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

console.log(
  craftEntry1.value,
  craftEntry2.value,
  craftAsset1.value,
  craftAsset2.value,
  craftEntryQuery1.value,
  craftEntryQuery2.value,
  craftAssetQuery1.value,
  craftAssetQuery2.value,
)

const { data, error } = useCraftQuery<BaseResT, 'entries'>('entries')
  .uri(uri.value)
  .site(currentSite.value.handle)
  .one()

if (error.value) {
  console.error(error.value)
}

console.log(data.value?.metadata)
</script>

<template>
  <div>
    <CraftPage v-if="data" :config="mapping" :content="data" />
  </div>
</template>
