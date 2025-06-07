<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  headlineTag: {
    type: Object,
    default: () => undefined,
  },
})
</script>

<template>
  <component :is="props.headlineTag?.value ?? 'h2'">{{ props.title }}</component>
</template>
