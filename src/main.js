import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import Events from "./components/Events.vue"
import Event from "./components/Event.vue"
import EventOtherVersion from "./components/EventOtherVersion.vue"
import Login from "./components/Login.vue"
import Register from "./components/Register.vue"
const router = createRouter({
  history: createWebHashHistory(),
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
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/events/:id',
      name: 'event',
      component: Event
    },
    {
      path: '/events/other_version/:id',
      name: 'eventOtherVersion',
      component: EventOtherVersion
    },
  ]
})
const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')