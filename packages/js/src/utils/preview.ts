import { PREVIEW_PARAMS } from '../constants'

export function getPreviewParams(
  searchParams: Record<string, string> | string = '',
): string | null {
  if (!searchParams) {
    if (typeof window === 'undefined') return null
    searchParams = window.location.search
  }
  const urlParams = new URLSearchParams(searchParams)

  const filteredKeys = Object.entries(Object.fromEntries(urlParams)).filter(([key]) =>
    PREVIEW_PARAMS.includes(key),
  )

  if (!filteredKeys.length) {
    return ''
  }

  return filteredKeys.map((val) => val.join('=')).join('&')
}
