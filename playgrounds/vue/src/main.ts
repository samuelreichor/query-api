import { CraftCms } from '@query-api/vue'
import { router } from './router'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.use(router).use(CraftCms, {
  baseUrl: 'https://backend-craftcms.ddev.site:8443',
  authToken: 'Bearer tyE9LViYm0HvcVbUErN1wwIa3qyeby1K',
  debug: true,
  registerComponents: true,
  enableEntryTypeMapping: true,
  siteMap: [
    {
      handle: 'en',
      path: '/',
      origin: 'https://localhost:3000',
      id: 3,
    },
  ],
})

app.mount('#app')
