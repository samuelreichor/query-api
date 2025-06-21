import { Route, Routes, Link } from 'react-router'
import CraftRouter from './CraftRouter'

export function App() {
  return (
    <div>
      <nav role="navigation">
        <Link to="/">Home</Link>
        <Link to="/news-article-1">News Article 1</Link>
      </nav>
      <Routes>
        <Route path="*" element={<CraftRouter />} />
      </Routes>
      {/* END: routes */}
    </div>
  )
}

export default App
