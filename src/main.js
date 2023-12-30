import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'

import Events from "./components/Events.vue"
import Login from "./components/Login.vue"
import Event from "./components/Event.vue"
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'events',
      component: Events
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/events/:id',
      name: 'event',
      component: Event
    },
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')