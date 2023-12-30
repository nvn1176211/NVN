import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'events',
      component: () => import('./components/Events.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./components/Login.vue')
    },
    {
      path: '/events/:id',
      name: 'event',
      component: () => import('./components/Event.vue')
    },
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')