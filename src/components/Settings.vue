<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useUserStore } from '../stores/UserStore';
import SubmitBtnComponent from './partials/SubmitBtn.vue';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStore();
const inputs = reactive({
	password: {
		errMsg: null,
		isInvalid: false,
		val: null,
	},
	new_password: {
		errMsg: null,
		isInvalid: false,
		val: null,
	},
	retype_new_password: {
		errMsg: null,
		isInvalid: false,
		val: null,
	}
});
const isChangingPassword = ref(false);

onMounted(() => {
    window.passwordChangingModal = new bootstrap.Modal(document.getElementById('passwordChangingModal'), {
        keyboard: false
    });
})

async function submitChangePassword() {
	isChangingPassword.value = true;
	helpers.refreshFormErrInput(inputs);
	if (!retypePasswordChecking()) {
		isChangingPassword.value = false;
		return false;
	}
	let formdata = new FormData();
	let api_token = helpers.getCookie('api_token');
	if (api_token) formdata.append("api_token", api_token);
	if (inputs.password.val) formdata.append("password", inputs.password.val);
	if (inputs.new_password.val) formdata.append("new_password", inputs.new_password.val);
	let response = await fetch(`${env.API_BASE}/users/password/change`, {
		method: "POST",
		headers: {
			'Accept': 'application/json',
		},
		body: formdata
	});
	const resBodyObj = await response.json();
	switch (response.status) {
		case 422:
			helpers.handleInvalidInput(resBodyObj, inputs, [], []);
			isChangingPassword.value = false;
			break;
		case 200:
			helpers.setCookieY('api_token', resBodyObj.api_token, 1, '/');
			passwordChangingModal.hide()
			sessionStorage.toastMsg = t("messages.successUpdatePassword")
			userStore.recentTriggerToast = Date.now()
			isChangingPassword.value = false;
			break;
		default:
			console.error("Something is wrong!");
	}
}

/**
 * @return Boolean
 */
function retypePasswordChecking() {
	if (inputs.retype_new_password.val != inputs.new_password.val) {
		inputs.retype_new_password.errMsg = t("messages.notMatchRetypeNewPassword")
		inputs.retype_new_password.isInvalid = true
		return false
	}
	return true
}
</script>

<template>
	<div class="mb-5">
		<h4>Account settings</h4>
	</div>
	<div class="row">
		<div class="col-12 col-md-6">
			<div class="d-flex justify-content-between">
				<h5 class="text-capitalize">{{ $t("labels.email") }}</h5>
				<div>{{ userStore.email }}</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-12 col-md-6">
			<div class="d-flex justify-content-between align-items-center">
				<h5 class="text-capitalize m-0">{{ $t("labels.password") }}</h5>
				<button type="button" data-bs-toggle="modal" data-bs-target="#passwordChangingModal"
					class="btn btn-primary text-capitalize">{{ $t("labels.change") }}</button>
			</div>
		</div>
	</div>
	<div class="modal fade" id="passwordChangingModal" tabindex="-1" aria-labelledby="passwordChangingModalLabel"
		aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title text-center text-capitalize" id="passwordChangingModalLabel">{{
					$t("labels.changePassword") }}
					</h5>
				</div>
				<div class="modal-body">
					<form class="pt-3 pb-4" id="change-password-form">
						<div class="mb-3">
							<label class="form-label text-capitalize" for="password">{{ $t("labels.currentPassword")
								}}:</label>
							<input id="password" :class="{ 'is-invalid': inputs.password.isInvalid }"
								v-model="inputs.password.val" class="form-control" type="text" name="password"
								autocomplete="off">
							<div class="invalid-feedback">{{ inputs.password.errMsg }}</div>
						</div>
						<div class="mb-3">
							<label class="form-label text-capitalize" for="new-password">{{ $t("labels.newPassword")
								}}:</label>
							<input id="new-password" :class="{ 'is-invalid': inputs.new_password.isInvalid }"
								v-model="inputs.new_password.val" class="form-control" type="text" name="new_password"
								autocomplete="off">
							<div class="invalid-feedback">{{ inputs.new_password.errMsg }}</div>
						</div>
						<div>
							<label class="form-label text-capitalize" for="retype-new-password">{{
					$t("labels.retypeNewPassword") }}:</label>
							<input id="retype-new-password"
								:class="{ 'is-invalid': inputs.retype_new_password.isInvalid }"
								v-model="inputs.retype_new_password.val" class="form-control" type="text"
								name="retype_new_password" autocomplete="off">
							<div class="invalid-feedback">{{ inputs.retype_new_password.errMsg }}</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{
					$t("labels.cancel") }}</button>
					<SubmitBtnComponent @submit="submitChangePassword" :isDisabled="isChangingPassword"
						class="text-capitalize">{{
					$t("labels.change") }}</SubmitBtnComponent>
				</div>
			</div>
		</div>
	</div>
</template>