import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router'
import * as ReactDOM from 'react-dom/client'
import App from './app/app'
import { baseConfig } from 'common'
import { craftInit, CraftNotImplemented } from '@query-api/react'
import Home from './app/views/Home'
import News from './app/views/News'
import Headline from './app/components/Headline'

craftInit({
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
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
