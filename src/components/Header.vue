<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../stores/UserStore';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from "vue-i18n";
import SearchComponent from './partials/Search.vue';

const { t, locale } = useI18n({ useScope: 'global' });
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const langDropdownMenuRef = ref(null);
const isOpenLangMenu = ref(false)
function toggleLangMenu() {
  isOpenLangMenu.value = !isOpenLangMenu.value;
}
function closeLangMenu() {
  isOpenLangMenu.value = false;
}
function chooseLocale(val) {
  locale.value = val;
}
onMounted(() => {
  document.getElementsByTagName('body')[0].onclick = function () {
    closeLangMenu()
  }
})

const darkModeVal = ref(false)
function darkModeSwitch() {
  darkModeVal.value = !darkModeVal.value
  let html = document.documentElement;
  html.setAttribute('data-bs-theme', html.getAttribute('data-bs-theme') == 'dark' ? '' : 'dark');
}

function logout() {
  helpers.setCookieY('api_token', 'value', -1, '/');
  userStore.$reset();
  sessionStorage.toastMsg = t("messages.successLogoutMsg")
  userStore.recentTriggerToast = Date.now()
  router.push('/');
}
function settings() {
  router.push('/settings')
}
</script>

<template>
  <nav class="border-bottom nav-bar zindex-fixed" id="myNav">
    <div class="ps-3 pe-3 position-relative">
      <div class="row">
        <div class="col-12 col-md-3 d-flex align-items-center">
          <router-link to="/" class="text-decoration-none">
            <h1 class="m-0">NVN</h1>
          </router-link>
        </div>
        <div class="col-12 col-md-6 d-flex align-items-center">
          <SearchComponent v-if="route.name == 'pages'" />
        </div>
        <div class="col-12 col-md-3 d-flex justify-content-end align-items-center">
          <div class="d-flex flex-column justify-content-center" v-if="userStore.isLoggedIn" id="header-user-info">
            <div class="dropdown">
              <img :src="userStore.avatar" alt="avatar" width="40" height="40"
                role="button" id="accountDropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside"
                class="me-2 rounded-circle" ref="avatarRef">
              <ul class="dropdown-menu" id="accountDropdownMenu" aria-labelledby="accountDropdownMenuButton">
                <li class="dropdown-item d-flex align-items-center" @click.stop="darkModeSwitch" role="button">
                  <i class="bi bi-moon fs-4 me-3"></i>
                  <div class="d-flex justify-content-between align-items-center flex-grow-1">
                    <div class="text-capitalize">{{ $t('labels.darkMode') }}</div>
                    <div class="form-check form-switch">
                      <input class="form-check-input switch-btn" type="checkbox" id="flexSwitchCheckDefault"
                        v-model="darkModeVal" role="button">
                    </div>
                  </div>
                </li>
                <li class="dropdown-item" role="button">
                  <div class="dropdown">
                    <div ref="langDropdownMenuRef" class="d-flex align-items-center"
                      @click.stop="toggleLangMenu" id="languageDropdownMenuButton" data-bs-toggle="dropdown"
                      :aria-expanded="isOpenLangMenu">
                      <i class="bi bi-translate fs-4 me-3"></i>
                      <div class="d-flex justify-content-between align-items-center flex-grow-1">
                        <span class="text-capitalize">{{ $t('labels.language') }}: {{
            $t(`labels.languages.${$i18n.locale}`) }}</span>
                        <i class="bi bi-chevron-down" v-if="isOpenLangMenu == false"></i>
                        <i class="bi bi-chevron-up" v-if="isOpenLangMenu == true"></i>
                      </div>
                    </div>
                    <ul class="dropdown-menu" aria-labelledby="languageDropdownMenuButton">
                      <li class="dropdown-item text-capitalize" v-for="locale in $i18n.availableLocales"
                        @click="chooseLocale(locale)">{{
            $t(`labels.languages.${locale}`) }}</li>
                    </ul>
                  </div>
                </li>
                <li class="dropdown-item text-capitalize d-flex align-items-center" role="button" @click="settings">
                  <i class="bi bi-gear fs-4 me-3"></i>
                  <span>{{ $t("labels.settings") }}</span>
                </li>
                <li class="dropdown-item text-capitalize d-flex align-items-center" role="button" @click="logout">
                  <i class="bi bi-box-arrow-right fs-4 me-3"></i>
                  <span>{{ $t("labels.logout") }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div v-if="!userStore.isLoggedIn" class="d-flex align-items-center">
            <router-link to="/login" class="btn btn-primary rounded-pill text-capitalize me-2">{{ $t("labels.login")
              }}</router-link>
            <div class="dropdown">
              <i class="bi bi-three-dots-vertical setting-btn" id="settingsDropdownMenuButton" role="button"
                :title="$t('labels.settings')" data-bs-toggle="dropdown" aria-expanded="false"
                data-bs-auto-close="outside"></i>
              <ul class="dropdown-menu" id="settingsDropdownMenu" aria-labelledby="settingsDropdownMenuButton">
                <li class="dropdown-item" @click.stop="darkModeSwitch" role="button">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="text-capitalize">{{ $t('labels.darkMode') }}</div>
                    <div class="form-check form-switch">
                      <input class="form-check-input switch-btn" type="checkbox" id="flexSwitchCheckDefault"
                        v-model="darkModeVal" role="button">
                    </div>
                  </div>
                </li>
                <li class="dropdown-item" role="button">
                  <div class="dropdown">
                    <div ref="langDropdownMenuRef" class="d-flex justify-content-between align-items-center"
                      @click.stop="toggleLangMenu" id="languageDropdownMenuButton" data-bs-toggle="dropdown"
                      :aria-expanded="isOpenLangMenu">
                      <span class="text-capitalize">{{ $t('labels.language') }}: {{
            $t(`labels.languages.${$i18n.locale}`) }}</span>
                      <i class="bi bi-chevron-down" v-if="isOpenLangMenu == false"></i>
                      <i class="bi bi-chevron-up" v-if="isOpenLangMenu == true"></i>
                    </div>
                    <ul class="dropdown-menu" aria-labelledby="languageDropdownMenuButton">
                      <li class="dropdown-item text-capitalize" v-for="locale in $i18n.availableLocales"
                        @click="chooseLocale(locale)">{{
            $t(`labels.languages.${locale}`) }}</li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-bar {
  position: fixed;
  width: 100%;
  background-color: white;
  padding-top: 5px;
  padding-bottom: 5px;
}

.search-bar-ctn {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.setting-btn {
  font-size: 1.25rem;
}

.form-check {
  margin-bottom: 0
}

.switch-btn {
  width: 40px;
  height: 24px;
  margin: 0;
}

#settingsDropdownMenu,
#accountDropdownMenu {
  width: 250px;
}

@media only screen and (min-width: 768px) {
  .search-input {
    width: 50%;
  }
}

[data-bs-theme=dark] .nav-bar {
  background-color: var(--bs-body-bg) !important;
}
</style>