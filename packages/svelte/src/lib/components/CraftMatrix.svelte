<script lang="ts">
  import type { ContentMapping, ComponentMapping, CraftAreaComponent } from '../types'
  import { getContext } from 'svelte'

  const { content, blockMapping = null } = $props<{
    content: unknown[]
    blockMapping?: ComponentMapping
  }>()

  const config = $derived(
    blockMapping
      ? { components: blockMapping as ComponentMapping }
      : (getContext<ContentMapping>('config') ?? null),
  )

  function getCurrentComponent(component: unknown) {
    if (!config || !('components' in config)) {
      throw new Error('Configuration is missing components or invalid. Check your config object')
    }

    const typedComponent = component as CraftAreaComponent

    if (!('type' in typedComponent) || typeof typedComponent.type !== 'string') {
      throw new Error('Provided content has no valid type set. Check your queried data.')
    }

    const cName = typedComponent.type
    const componentEl = config.components?.[cName]

    if (!componentEl) {
      console.error(`No mapped component found for component type: ${cName}`)
    }

    return componentEl
  }
</script>

<div>
  {#each content as component, index (index)}
    {@const Component = getCurrentComponent(component)}
    {#if Component}
      <Component {...component} />
    {/if}
  {/each}
</div>
