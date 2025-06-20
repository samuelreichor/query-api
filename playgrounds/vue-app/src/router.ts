import { createRouter, createWebHistory } from 'vue-router'
import CraftRouter from './CraftRouter.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: CraftRouter }],
})
