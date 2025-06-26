import { CraftCms } from '@query-api/vue'
import { router } from './router'
import { createApp } from 'vue'
import App from './App.vue'
import { baseConfig } from 'common'

const app = createApp(App)

app.use(router).use(CraftCms, baseConfig)

app.mount('#app')
