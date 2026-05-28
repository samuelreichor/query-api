import { initQueryApi } from '@query-api/svelte'
import { getRequestEvent } from '$app/server'
import { baseConfig } from 'common'

initQueryApi({
  ...baseConfig,
  debug: true,
  getRequestEvent,
})
