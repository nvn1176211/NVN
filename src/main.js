import './assets/main.css'
import * as env from "./env.js"; window.env = env;
import * as helpers from "./helper.js"; window.helpers = helpers;
import * as bootstrap from 'bootstrap'; window.bootstrap = bootstrap;
import CKCustomUploadAdapter from './ckCustomUploadAdapter'; window.CKCustomUploadAdapter = CKCustomUploadAdapter;
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
import Pages from "./components/Pages.vue"
import PageCreation from './components/PageCreation.vue';
import Article from "./components/Article.vue"
import Discussion from "./components/Discussion.vue"
import Login from "./components/Login.vue"
import Register from "./components/Register.vue"
const router = createRouter({
  history: createWebHistory(),
  // history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'pages',
      component: Pages
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
      path: '/create_page',
      name: 'createPage',
      component: PageCreation
    },
    // {
    //   path: '/events/:id',
    //   name: 'event',
    //   component: Event
    // },
    {
      path: '/articles/:id',
      name: 'article',
      component: Article
    },
    {
      path: '/discussions/:id',
      name: 'discussion',
      component: Discussion
    },
  ]
});
// some page need beforeEach fetch auth data for redirect as soon as
router.beforeEach(async (to, from) => {
  if(to.name != 'login' && to.name != 'register' && to.name != 'createPage' && to.name != 'article' && to.name != 'discussion'){
    return true;
  }
  const userStore = useUserStore();
  let api_token = helpers.getCookie('api_token');
  if (api_token) {
    const response = await fetch(`${env.API_BASE}/user?api_token=${api_token}`, {
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
        helpers.setCookieY('api_token', null, -1, '/');
        userStore.$reset();
    }
  }
  if (
    ((to.name == "login" || to.name == 'register') && userStore.isLoggedIn)
    || (to.name == "createPage" && !userStore.isLoggedIn)
  ) {
    return { name: 'events' }
  }
})
// only afterEach fetch auth data in specific pages for increase perfomance
router.afterEach(async (to, from) => {
  if(to.name != 'pages'){
    return false;
  }
  const userStore = useUserStore();
  let api_token = helpers.getCookie('api_token');
  if (api_token) {
    const response = await fetch(`${env.API_BASE}/user?api_token=${api_token}`, {
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
        helpers.setCookieY('api_token', null, -1, '/');
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