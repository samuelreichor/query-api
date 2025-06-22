import Link from 'next/link'
import { craftInit } from '@query-api/next'
import { baseConfig } from 'common'

craftInit({
  ...baseConfig,
  contentMapping: {
    pages: {},
    components: {},
  },
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
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
  )
}
