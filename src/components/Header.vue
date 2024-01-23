<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '../stores/UserStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
onMounted(async () => {
	let api_token = getCookie('api_token');
  if(!api_token) return false;
	const response = await fetch(`https://nvn1.000webhostapp.com/api/user?api_token=${api_token}`);
  const resBodyObj = await response.json();
	switch (response.status) {
		case 200:
			userStore.username = resBodyObj.username;
			userStore.isAdmin = resBodyObj.isAdmin;
			userStore.isLoggedIn = true;
			break;
	}
});
function darkModeSwitch() {
  let html = document.documentElement;
  html.setAttribute('data-bs-theme', html.getAttribute('data-bs-theme') == 'dark' ? '' : 'dark');
}
function logout(){
  setCookieY('api_token', 'value', -1, '/');
  userStore.$reset();
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
        <i class="bi bi-circle-half p-2 me-2 cursor-pointer" @click="darkModeSwitch()"></i>
        <select v-model="$i18n.locale" class="form-select">
          <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ locale }}</option>
        </select>
      </div>
      <div class="d-flex flex-column justify-content-center" v-if="userStore.isLoggedIn" id="header-user-info">
        <div>
          <span class="badge bg-primary" id="header-user-username">{{ userStore.username }}</span>
          <span v-if="userStore.isAdmin" class="badge bg-info" id="header-admin-label">Admin</span>
        </div>
        <button type="button" class="btn btn-link p-0" @click="logout">Log Out</button>
      </div>
      <router-link to="/login" v-if="!userStore.isLoggedIn" class="text-capitalize">{{ $t("labels.login") }}</router-link>
    </div>
  </div>
</template>