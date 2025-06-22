'use client'

import type { ComponentProps } from 'react'
import { CraftProvider } from '@query-api/react/react'

type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type Props = MakeOptional<ComponentProps<typeof CraftProvider>, 'location'>

export default function CraftClientProvider({ config, location, children }: Props) {
  /**
   * location is not required here because we can use the headers to extract the location.
   * This enhances the development experience, but migh
   */
  return (
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    <CraftProvider config={config} location={location!}>
      {children}
    </CraftProvider>
  )
}
