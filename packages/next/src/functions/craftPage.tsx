import React from 'react'
import { notFound } from 'next/navigation'
import type { CraftPageEntry } from '@query-api/react/core'
import { CraftPageError, getCraftInstance, resolvePageComponent } from '@query-api/react/core'

type Props = {
  content: object
}

/**
 * Next.js-aware version of CraftPage. When no page component can be resolved
 * and no error page is mapped in the contentMapping, a 404 triggers Next's
 * notFound() so the app's not-found page is rendered with a real 404 status —
 * the equivalent of the craftPageErrorHandler provided by @query-api/nuxt.
 */
const CraftPage: React.FC<Props> = ({ content }) => {
  let PageComponent: React.ElementType
  try {
    PageComponent = resolvePageComponent(getCraftInstance(), content as CraftPageEntry)
  } catch (err) {
    if (err instanceof CraftPageError && err.statusCode === 404) {
      notFound()
    }
    throw err
  }
  return <PageComponent {...content} />
}

export default CraftPage
