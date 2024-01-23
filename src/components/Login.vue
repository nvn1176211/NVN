<script setup>
import { ref, reactive } from 'vue';
import SubmitBtnComponent from './partials/SubmitBtn.vue';
import { useUserStore } from '../stores/UserStore';
import { useRouter } from 'vue-router';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const isDisabledBtn = ref(false);
const input = reactive({
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
async function login(){
    refreshFormErrInput(input);
    isDisabledBtn.value = true;
    let formdata = new FormData();
    if (input.username.val) formdata.append("username", input.username.val);
    if (input.password.val) formdata.append("password", input.password.val);
    const response = await fetch('https://nvn1.000webhostapp.com/api/login', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
        },
        body: formdata
    });
    const resBodyObj = await response.json();
    switch (response.status) {
        case 422:
            handleInvalidInput(resBodyObj, input);
            break;
        case 200:
            alert(t("messages.successLoginMsg"));
            setCookieY('api_token', resBodyObj.api_token, 1, '/');
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
                <form method="post" id="loginForm">
                    <div class="mb-3 mt-3">
                        <label class="form-label text-capitalize">{{ $t("labels.username") }}:</label>
                        <input :class="{ 'is-invalid': input.username.isInvalid }" v-model="input.username.val" class="form-control" type="text" name="username" autocomplete="off">
                        <div class="invalid-feedback">{{ input.username.errMsg }}</div>
                    </div>
                    <div class="mb-5 mt-3">
                        <label class="form-label text-capitalize">{{ $t("labels.password") }}:</label>
                        <input :class="{ 'is-invalid': input.password.isInvalid }" v-model="input.password.val" class="form-control" type="text" name="password" autocomplete="off">
                        <div class="invalid-feedback">{{ input.password.errMsg }}</div>
                    </div>
                    <div class="d-flex justify-content-between">
                        <router-link to="/register" class="text-capitalize">{{ $t("labels.createAcc") }}</router-link>
                        <SubmitBtnComponent @submit="login" :isDisabled="isDisabledBtn" class="text-capitalize">{{ $t("labels.login") }}</SubmitBtnComponent>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>