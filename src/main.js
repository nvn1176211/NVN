import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

//store
import { createPinia } from 'pinia'
const pinia = createPinia()
app.use(pinia)

//router
import { useUserStore } from './stores/UserStore';
import { createRouter, createWebHashHistory } from 'vue-router'
import Events from "./components/Events.vue"
import Event from "./components/Event.vue"
import EventCreate from "./components/EventCreate.vue"
import EventOtherVersion from "./components/EventOtherVersion.vue"
import Login from "./components/Login.vue"
import Register from "./components/Register.vue"
const userStore = useUserStore();
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
      path: '/create_event',
      name: 'createEvent',
      component: EventCreate
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
});
router.beforeEach((to, from) => {
  const userStore = useUserStore();
  if(
    ((to.name == "login" || to.name == 'register') && userStore.isLoggedIn)
    || (to.name == "createEvent" && !userStore.isLoggedIn)
    ){
    return { name: 'events' }
  }
})
app.use(router)

//localization
import { createI18n } from 'vue-i18n'
import enLabels from "./locales/en/labels.json"
import viLabels from "./locales/vi/labels.json"
import enMessages from "./locales/en/messages.json"
import viMessages from "./locales/vi/messages.json"
const messages = {
  en: {
    labels: enLabels, 
    messages: enMessages, 
  },
  vi: {
    labels: viLabels,
    messages: viMessages, 
  },
};
const i18n = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages,
})
app.use(i18n)

app.mount('#app')