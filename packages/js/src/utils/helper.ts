export function getPreviewParams(
  searchParams: Record<string, string> | string = '',
): string | null {
  if (!searchParams) {
    if (typeof window === 'undefined') return null
    searchParams = window.location.search
  }
  const urlParams = new URLSearchParams(searchParams)
  const previewKeys = ['x-craft-preview', 'x-craft-live-preview', 'token']

  const filteredKeys = Object.entries(Object.fromEntries(urlParams)).filter(([key]) =>
    previewKeys.includes(key),
  )

  if (!filteredKeys.length) {
    return ''
  }

  return filteredKeys.map((val) => val.join('=')).join('&')
}

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
