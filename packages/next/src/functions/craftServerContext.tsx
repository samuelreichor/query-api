import BaseCraftClientProvider from '../client/craftClientContext'
import type { ComponentProps } from 'react'
import { getCraftSiteHeaders } from './middleware'

type Props = ComponentProps<typeof BaseCraftClientProvider>

export default async function CraftClientProvider({ config, children }: Props) {
  const { path, url } = await getCraftSiteHeaders()
  const location = {
    pathname: path ?? '',
    absoluteUrl: url ?? '',
  }
  /**
   * Unfortunately we need to delete the contentMapping config here because nextJs does
   * not allow to pass server components to client components through props.
   */
  const { contentMapping, ...configWithoutContentMapping } = config

  return (
    <BaseCraftClientProvider config={configWithoutContentMapping} location={location}>
      {children}
    </BaseCraftClientProvider>
  )
}
