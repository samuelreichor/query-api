import { Route, Routes, Link, useLocation } from 'react-router'
import CraftRouter from './CraftRouter'
import { baseConfig } from 'common'
import { craftInit, CraftNotImplemented, CraftProvider, getCraftLocation } from '@query-api/react'
import Home from './views/Home'
import News from './views/News'
import Headline from './components/Headline'

const craftConfig = craftInit({
  ...baseConfig,
  contentMapping: {
    pages: {
      home: Home,
      'news:home': News,
    },
    components: {
      headline: Headline,
      imageText: CraftNotImplemented,
    },
  },
})

export function App() {
  const location = getCraftLocation(useLocation())
  return (
    <CraftProvider config={craftConfig} location={location}>
      <div>
        <nav role="navigation">
          <Link to="/">Home</Link>
          <Link to="/news-article-1">News Article 1</Link>
        </nav>
        <Routes>
          <Route path="*" element={<CraftRouter />} />
        </Routes>
      </div>
    </CraftProvider>
  )
}

export default App
