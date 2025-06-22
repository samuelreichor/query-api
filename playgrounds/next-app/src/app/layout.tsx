import Link from 'next/link'
import { CraftClientProvider, craftInit, CraftNotImplemented } from '@query-api/next'
import { baseConfig } from 'common'
import Home from '@/content/pages/Home'
import Headline from '@/content/components/Headline'

export const craftConfig = craftInit({
  ...baseConfig,
  contentMapping: {
    pages: {
      home: Home,
      'news:home': CraftNotImplemented,
    },
    components: {
      headline: Headline,
    },
  },
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <CraftClientProvider config={craftConfig}>
      <html lang="en">
        <body>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/news-article-1">NewsArticle 1</Link>
            </li>
            <li>
              <Link href="/de">DE</Link>
            </li>
            <li>
              <Link href="/es">Es</Link>
            </li>
          </ul>
          {children}
        </body>
      </html>
    </CraftClientProvider>
  )
}
