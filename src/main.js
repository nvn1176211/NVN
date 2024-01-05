import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'

import Events from "./components/Events.vue"
import Event from "./components/Event.vue"
import EventOtherVersion from "./components/EventOtherVersion.vue"
import Login from "./components/Login.vue"
import Register from "./components/Register.vue"
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

const app = createApp(App)
app.use(router)
app.mount('#app')