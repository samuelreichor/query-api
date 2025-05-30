<script lang="ts" setup>
  import type { Config, CraftAreaComponent } from '../types';
  import { inject } from 'vue';
  import type { PropType } from 'vue';
  const props = defineProps({
    content: {
      type: Array as PropType<unknown[]>,
      required: true,
    },
  });

  const config = inject<Config>('config');

  function getCurrentComponent(component: unknown) {
    if (!config || !('components' in config)) {
      throw new Error('Configuration is missing components or invalid. Check your config object');
    }

    const typedComponent = component as CraftAreaComponent;

    if (!('type' in typedComponent) || typeof typedComponent.type !== 'string') {
      throw new Error('Provided content has no valid type set. Check your queried data.');
    }

    const cName = typedComponent.type;
    const componentEl = config.components[cName];

    if (!componentEl) {
      console.error(`No mapped component found for component type: ${cName}`);
    }

    return componentEl;
  }
</script>

<template>
  <div>
    <div v-for="(component, index) in props.content" :key="index">
      <component :is="getCurrentComponent(component)" v-bind="component as CraftAreaComponent" />
    </div>
  </div>
</template>
