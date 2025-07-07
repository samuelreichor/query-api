import { createContext, ReactNode, useContext } from 'react'
import type { CraftOptions } from '../types'

type CraftContextType = {
  config: CraftOptions
  location: Location
}

export const CraftContext = createContext<CraftContextType | undefined>(undefined)

type Location = {
  pathname: string
  absoluteUrl: string
}
type CraftContextProps = {
  config: CraftOptions
  location: Location
  children: ReactNode
}

export function CraftProvider({ config, location, children }: CraftContextProps) {
  const value = {
    config: config,
    location,
  }

  return <CraftContext.Provider value={value}>{children}</CraftContext.Provider>
}

export function useCraftContext() {
  const context = useContext(CraftContext)
  if (context === undefined) {
    throw new Error('useCraftContext must be used within the CraftProvider')
  }

  return context
}

export function useCraftConfigContext() {
  const { config } = useCraftContext()

  if (config === undefined) {
    throw new Error('you must provide a valid config in the CraftProvider')
  }
  return config
}

export function useCraftLocationContext() {
  const { location } = useCraftContext()

  if (location === undefined) {
    throw new Error('you must provide a valid location in the CraftProvider')
  }
  return location
}

export function useCraftContentMapping() {
  const { contentMapping } = useCraftConfigContext()
  if (contentMapping === undefined) {
    throw new Error(
      'You can not use getContentMapping if you don not provide a valid contentMapping in the CraftProvider.',
    )
  }

  return contentMapping
}
