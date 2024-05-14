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

import router from './router'
app.use(router)

import i18n from './i18n'
app.use(i18n)

app.mount('#app')