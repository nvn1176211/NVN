import './assets/main.css'
import "./env.js"
import "./helper.js"
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

//store
import { createPinia } from 'pinia'
app.use(createPinia())

//router
import { useUserStore } from './stores/UserStore';
// import { createRouter, createWebHashHistory } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import Events from "./components/Events.vue"
import EventTag from "./components/EventTag.vue"
import EventCreate from "./components/EventCreate.vue"
import EventOtherVersion from "./components/EventOtherVersion.vue"
import Login from "./components/Login.vue"
import Register from "./components/Register.vue"
const router = createRouter({
  history: createWebHistory(),
  // history: createWebHashHistory(),
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
    // {
    //   path: '/events/:id',
    //   name: 'event',
    //   component: Event
    // },
    {
      path: '/event_tags/:id',
      name: 'eventTag',
      component: EventTag
    },
    {
      path: '/events/other_version/:id',
      name: 'eventOtherVersion',
      component: EventOtherVersion
    },
  ]
});
// some page need beforeEach fetch auth data for redirect as soon as
router.beforeEach(async (to, from) => {
  if(to.name != 'login' && to.name != 'register' && to.name != 'createEvent' && to.name != 'eventTag'){
    return true;
  }
  const userStore = useUserStore();
  let api_token = getCookie('api_token');
  if (api_token) {
    const response = await fetch(`${API_BASE}/user?api_token=${api_token}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    const resBodyObj = await response.json();
    switch (response.status) {
      case 200:
        userStore.username = resBodyObj.username;
        userStore.isAdmin = resBodyObj.is_admin;
        userStore.isLoggedIn = true;
        break;
      case 401:
        setCookieY('api_token', null, -1, '/');
        userStore.$reset();
    }
  }
  if (
    ((to.name == "login" || to.name == 'register') && userStore.isLoggedIn)
    || (to.name == "createEvent" && !userStore.isLoggedIn)
  ) {
    return { name: 'events' }
  }
})
// only afterEach fetch auth data in specific pages for increase perfomance
router.afterEach(async (to, from) => {
  if(to.name != 'events' && to.name != 'eventOtherVersion'){
    return false;
  }
  const userStore = useUserStore();
  let api_token = getCookie('api_token');
  if (api_token) {
    const response = await fetch(`${API_BASE}/user?api_token=${api_token}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    const resBodyObj = await response.json();
    switch (response.status) {
      case 200:
        userStore.username = resBodyObj.username;
        userStore.isAdmin = resBodyObj.is_admin;
        userStore.isLoggedIn = true;
        break;
      case 401:
        setCookieY('api_token', null, -1, '/');
        userStore.$reset();
    }
  }
})
app.use(router)

//localization
import { createI18n } from 'vue-i18n'
import enLabels from "./locales/en/labels.json"
import viLabels from "./locales/vi/labels.json"
import enMessages from "./locales/en/messages.json"
import viMessages from "./locales/vi/messages.json"
const localeData = {
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
  messages: localeData,
})
app.use(i18n)

app.mount('#app')