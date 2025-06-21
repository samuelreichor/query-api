import React from 'react'
import { getContentMapping, getCraftInstance } from '../composables/useApi'
import type { ContentMapping, CraftPageEntry } from '../types'

function handleError(
  contentMapping: ContentMapping,
  code: '404',
  message: string,
): React.ElementType {
  const pages = contentMapping.pages
  const page404 = pages[`page${code}`]
  if (page404) {
    return page404
  }
  const errorPage = pages.error
  if (errorPage) {
    return errorPage
  }
  throw new Error(message)
}

function resolvePageComponent(
  contentMapping: ContentMapping,
  content: CraftPageEntry,
): React.ElementType {
  const { pages } = contentMapping
  if (!pages) {
    throw new Error(
      'ContentMapping configuration is missing the "pages" property or is invalid. Check your "contentMapping" object.',
    )
  }

  const section = content.sectionHandle
  if (!section) {
    return handleError(
      contentMapping,
      '404',
      'Section handle not found in queried data. Check your query or prevent it by defining an error page.',
    )
  }

  const entryType = content.metadata?.entryType ?? 'default'
  const enableTypeMap = getCraftInstance()?.enableEntryTypeMapping ?? false

  // Try section:entryType
  if (enableTypeMap && entryType !== 'default' && entryType !== section) {
    const key = `${section}:${entryType}`
    const Page = pages[key]
    if (Page) {
      return Page
    }
  }

  // Try section
  const Page = pages[section]
  if (Page) {
    return Page
  }

  const baseErrMsg = `No mapped page found for section handle "${section}"`
  const entryTypeErrMsg = `${baseErrMsg} with entry type handle "${entryType}"`
  return handleError(
    contentMapping,
    '404',
    enableTypeMap ? `${entryTypeErrMsg}.` : `${baseErrMsg}.`,
  )
}

type Props = {
  content: CraftPageEntry
}

const CraftPage: React.FC<Props> = ({ content }) => {
  const PageComponent = resolvePageComponent(getContentMapping(), content)
  return <PageComponent {...content} />
}

export default CraftPage
