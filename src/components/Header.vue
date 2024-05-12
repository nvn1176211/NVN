<script setup>
import { useUserStore } from '../stores/UserStore';
import { useRouter } from 'vue-router';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
function darkModeSwitch() {
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
</script>

<template>
  <div class="d-flex justify-content-between mb-5">
    <h1 class="m-0">
      <router-link to="/" class="text-decoration-none">NVN</router-link>
    </h1>
    <div class="d-flex align-items-center">
      <div class="me-3 d-flex align-items-center">
        <i class="bi bi-circle-half  fs-3 p-2 me-2 cursor-pointer" @click="darkModeSwitch()"></i>
        <select v-model="$i18n.locale" class="form-select" name="locale" role="button">
          <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ locale }}
          </option>
        </select>
      </div>
      <div class="d-flex flex-column justify-content-center" v-if="userStore.isLoggedIn" id="header-user-info">
        <div class="dropdown">
          <i class="bi bi-person-circle fs-3" role="button" id="accountDropdownMenuButton" data-bs-toggle="dropdown"
            aria-expanded="false"></i>
          <ul class="dropdown-menu" aria-labelledby="accountDropdownMenuButton">
            <li>
              <router-link to="/settings" class="dropdown-item text-capitalize">{{ $t("labels.settings")
                }}</router-link>
            </li>
            <li>
              <button type="button" class="dropdown-item text-capitalize" @click="logout">{{ $t("labels.logout")
                }}</button>
            </li>
          </ul>
        </div>
        <!-- <div>
          <span class="badge bg-primary me-1" id="header-user-username">{{ userStore.username }}</span>
          <span v-if="userStore.isAdmin" class="badge bg-info" id="header-admin-label">Admin</span>
        </div>
        <button type="button" class="btn btn-link p-0 text-capitalize" @click="logout">{{ $t("labels.logout") }}</button> -->
      </div>
      <router-link to="/login" v-if="!userStore.isLoggedIn" class="text-capitalize">{{ $t("labels.login")
        }}</router-link>
    </div>
  </div>
</template>