import { createHmac, timingSafeEqual } from 'node:crypto'
import { createError, defineEventHandler, getHeader, readRawBody } from 'h3'
import { useRuntimeConfig, useStorage } from 'nitropack/runtime'
import type { CacheWebhookPayload } from '@query-api/nuxt'

/**
 * Receives cache invalidation webhooks from the Craft Query API plugin and clears
 * all Nitro caches (routeRules cache/swr/isr, cachedEventHandler, cachedFunction).
 *
 * Craft config (config/query-api.php):
 *   'webhooks' => [['url' => 'https://your-site.tld/api/craft/webhook', 'secret' => '$QUERY_API_WEBHOOK_SECRET']]
 * Nuxt: set the same secret via NUXT_CRAFT_WEBHOOK_SECRET.
 */
export default defineEventHandler(async (event) => {
  const { craftWebhookSecret } = useRuntimeConfig(event)
  if (!craftWebhookSecret) {
    throw createError({ statusCode: 500, statusMessage: 'Webhook secret is not configured' })
  }

  const body = (await readRawBody(event, 'utf8')) ?? ''
  const signature = getHeader(event, 'x-query-api-signature') ?? ''
  const expected = 'sha256=' + createHmac('sha256', craftWebhookSecret).update(body).digest('hex')
  if (
    signature.length !== expected.length ||
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid signature' })
  }

  const payload = JSON.parse(body) as CacheWebhookPayload
  if (payload.event !== 'invalidate') {
    return { cleared: 0 }
  }

  // Nitro stores its caches under `cache:nitro:{routes,handlers,functions}`.
  // Keys are removed one by one, because `clear()` on a prefixed storage skips
  // entries that live in a parent mount (e.g. the default in-memory storage).
  const storage = useStorage('cache:nitro')
  const keys = await storage.getKeys()
  await Promise.all(keys.map((key) => storage.removeItem(key)))

  return { cleared: keys.length }
})
