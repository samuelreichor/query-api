import type { CraftCmsOptions, Prettify } from '@query-api/vue'

export type QueryApiOptions = Prettify<
  CraftCmsOptions & {
    caching?:
      | boolean
      | {
          ttl: number
        }
  }
>
