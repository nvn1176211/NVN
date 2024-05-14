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
export default i18n;