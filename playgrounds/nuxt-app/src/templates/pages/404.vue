<script setup lang="ts">
import { setResponseStatus, useRequestEvent } from '#imports'

const event = useRequestEvent()
if (event) {
  setResponseStatus(event, 404, 'Page Not Found')
}
</script>

<template>Ah Dang, 404 Page not found</template>
