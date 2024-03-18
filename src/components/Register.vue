<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import SubmitBtnComponent from './partials/SubmitBtn.vue';
import { useUserStore } from '../stores/UserStore';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStore();
const router = useRouter();
const input = reactive({
    email: {
        errMsg: null,
        isInvalid: false,
        val: null,
    },
    username: {
        errMsg: null,
        isInvalid: false,
        val: null,
    },
    password: {
        errMsg: null,
        isInvalid: false,
        val: null,
    }
});
const isDisabledBtn = ref(false);
async function register() {
    helpers.refreshFormErrInput(input);
    isDisabledBtn.value = true;
    let formdata = new FormData();
    if (input.email.val) formdata.append("email", input.email.val);
    if (input.username.val) formdata.append("username", input.username.val);
    if (input.password.val) formdata.append("password", input.password.val);
    const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
        },
        body: formdata
    });
    const resBodyObj = await response.json();
    switch (response.status) {
        case 422:
            helpers.handleInvalidInput(resBodyObj, input);
            break;
        case 201:
            alert(t("messages.successRegisterMsg"));
            helpers.setCookieY('api_token', resBodyObj.api_token, 1, '/');
            userStore.username = resBodyObj.username;
			userStore.isAdmin = resBodyObj.isAdmin;
			userStore.isLoggedIn = true;
            router.push('/');
            break;
    }
    isDisabledBtn.value = false;
}
</script>

<template>
    <div class="row justify-content-center">
        <div class="col col-md-6">
            <div class="card p-5 m-auto mt-5">
                <h3 class="card-title text-center">
                    <router-link to="/" class="text-decoration-none">NVN</router-link>
                </h3>
                <form>
                    <div class="mb-3 mt-3">
                        <label for="email" class="form-label text-capitalize">{{ $t("labels.email") }}:</label>
                        <input id="email" :class="{ 'is-invalid': input.email.isInvalid }" class="form-control"
                            v-model="input.email.val" type="text" name="email" autocomplete="off">
                        <div class="invalid-feedback">{{ input.email.errMsg }}</div>
                    </div>
                    <div class="mb-3 mt-3">
                        <label for="username" class="form-label text-capitalize">{{ $t("labels.username") }}:</label>
                        <input id="username" :class="{ 'is-invalid': input.username.isInvalid }" class="form-control"
                            v-model="input.username.val" type="text" name="username" autocomplete="off">
                        <div class="invalid-feedback">{{ input.username.errMsg }}</div>
                    </div>
                    <div class="mb-5 mt-3">
                        <label for="password" class="form-label text-capitalize">{{ $t("labels.password") }}:</label>
                        <input id="password" :class="{ 'is-invalid': input.password.isInvalid }" class="form-control"
                            v-model="input.password.val" type="password" name="password" autocomplete="off">
                        <div class="invalid-feedback">{{ input.password.errMsg }}</div>
                    </div>
                    <div class="mb-3 mt-3 text-end">
                        <SubmitBtnComponent @submit="register" :isDisabled="isDisabledBtn" class="text-capitalize">{{ $t("labels.register") }}</SubmitBtnComponent>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>