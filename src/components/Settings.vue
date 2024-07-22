<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useUserStore } from '../stores/UserStore';
import SubmitBtnComponent from './partials/SubmitBtn.vue';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStore();
const isSubmitting = ref(false);
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

const avatarInputRef = ref(null)
const avatarRef = ref(null)
const inputs2 = reactive({
	avatar: {
		errMsg: null,
		isInvalid: false,
		val: null,
		isShowInput: false,
	},
	display_name: {
		errMsg: null,
		isInvalid: false,
		val: null,
		isShowInput: false,
	},
});
function uploadAvatar() {
	inputs2.avatar.isShowInput = true
	avatarInputRef.value.click();
}
function previewAvatar() {
	const file = avatarInputRef.value.files[0];
	if (!file) return false
	inputs2.avatar.isInvalid = false
	inputs2.avatar.errMsg = null
	const acceptedTypes = ['image/jpeg', 'image/png']
	if (acceptedTypes.indexOf(file.type) != -1) {
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			avatarRef.value.setAttribute("src", reader.result)
		};
	} else {
		inputs2.avatar.isInvalid = true
		inputs2.avatar.errMsg = t("messages.avatarWrongFile", { types: 'image/jpeg, image/png' })
		avatarInputRef.value.files[0] = null;
	}
}

/**
 * String category
 * @return Void
 */
function cancelUpdateAccInfo(category) {
	if (category == 'avatar') {
		avatarRef.value.setAttribute("src", userStore.avatar)
	}else{
		inputs2[category].val = userStore[category]
	}
	inputs2[category].errMsg = null
	inputs2[category].isInvalid = false
	inputs2[category].isShowInput = false
}

/**
 * String category
 * @return Void
 */
// async function saveAvatar() {
async function update(category) {
	isSubmitting.value = true;
	let formdata = new FormData();
	let api_token = helpers.getCookie('api_token');
	if (api_token) formdata.append("api_token", api_token);

	switch (category) {
		case 'avatar':
			const file = avatarInputRef.value.files[0];
			if (!file) {
				// console.log('file is missing')
				isSubmitting.value = false;
				inputs2[category].isShowInput = false
				return false;
			} else {
				formdata.append("avatar", file);
			}
			break;
		default:
			formdata.append(category, inputs2[category].val);
			break;
	}
	let response = await fetch(env.USERS_UPDATE_API, {
		method: "POST",
		headers: {
			'Accept': 'application/json',
		},
		body: formdata
	});
	const resBodyObj = await response.json();
	switch (response.status) {
		case 422:
			switch (category) {
				case 'avatar':
					inputs2.avatar.isInvalid = true
					inputs2.avatar.errMsg = resBodyObj.errors.avatar[0]
					break;
				default:
					inputs2[category].isInvalid = true
					inputs2[category].errMsg = resBodyObj.errors[category][0]
					break;
			}
			isSubmitting.value = false;
			break;
		case 200:
			userStore[category] = resBodyObj[category]
			// userStore.avatar = resBodyObj.avatar
			sessionStorage.toastMsg = t("messages.successUpdateAccount")
			userStore.recentTriggerToast = Date.now()
			isSubmitting.value = false;
			inputs2[category].isShowInput = false
			break;
		default:
			console.error("Something is wrong!");
	}
}

const genderInput = ref('3');
const isShowGenderInput = ref(false)
const genderList = ref([])
const genderSelectRef = ref(null)
const genderStage = ref(null)
const genderStageVi = ref(null)

const locationInput = ref('1');
const isShowLocationInput = ref(false)
const locationList = ref([])
const locationSelectRef = ref(null)
const locationStage = ref(null)
const locationStageVi = ref(null)

const isLoadingSpinActive = ref(true);
onMounted(async () => {
	window.passwordChangingModal = new bootstrap.Modal(document.getElementById('passwordChangingModal'), {
		keyboard: false
	});

	await fetch(`${env.GENDER_LIST_API}`)
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			genderList.value = json;
		});
	await fetch(`${env.LOCATION_LIST_API}`)
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			locationList.value = json;
		});

	let api_token = helpers.getCookie('api_token') ?? '';
	await fetch(`${env.USERS_INFO_API}?api_token=${api_token}`)
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			userStore.display_name = json.display_name;
			inputs2.display_name.val = json.display_name;
			userStore.gender_id = '' + json.gender_id;
			genderInput.value = '' + json.gender_id;
			userStore.location_id = json.location_id;
			locationInput.value = '' + json.location_id;
			userStore.description = json.description;
			if (json.avatar) {
				userStore.avatar = json.avatar;
			}
			userStore.email = json.email;
			makeStage();
			isLoadingSpinActive.value = false;
		});
})

/**
 * @return Void
 */
function makeStage() {
	genderList.value.every(element => {
		if (element.id == userStore.gender_id) {
			genderStage.value = element.name
			genderStageVi.value = element.name_vi
			return false
		} else {
			return true
		}
	});
	locationList.value.every(element => {
		if (element.id == userStore.location_id) {
			locationStage.value = element.name
			locationStageVi.value = element.name_vi
			return false
		} else {
			return true
		}
	});
}

async function submitChangePassword() {
	isSubmitting.value = true;
	helpers.refreshFormErrInput(inputs);
	if (!retypePasswordChecking()) {
		isSubmitting.value = false;
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
			isSubmitting.value = false;
			break;
		case 200:
			helpers.setCookieY('api_token', resBodyObj.api_token, 1, '/');
			passwordChangingModal.hide()
			sessionStorage.toastMsg = t("messages.successUpdatePassword")
			userStore.recentTriggerToast = Date.now()
			isSubmitting.value = false;
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
	<div class="d-flex justify-content-center" v-if="isLoadingSpinActive">
		<span class="spinner-border spinner-border-sm tag-search-spin" role="status" aria-hidden="true"></span>
	</div>
	<div v-show="!isLoadingSpinActive">
		<div class="mb-4">
			<h4 class="text-capitalize mb-4">{{ $t("labels.settings") }}</h4>
			<div>
				<ul class="nav nav-tabs" id="myTab" role="tablist">
					<li class="nav-item" role="presentation">
						<button class="text-capitalize nav-link active" id="account-tab" data-bs-toggle="tab"
							data-bs-target="#account" type="button" role="tab" aria-controls="account"
							aria-selected="true">{{ $t("labels.account") }}</button>
					</li>
					<li class="nav-item" role="presentation">
						<button class="text-capitalize nav-link" id="profile-tab" data-bs-toggle="tab"
							data-bs-target="#profile" type="button" role="tab" aria-controls="profile"
							aria-selected="false">{{ $t("labels.profile") }}</button>
					</li>
				</ul>
			</div>
		</div>
		<div class="tab-content" id="myTabContent">
			<div class="tab-pane fade show active" id="account" role="tabpanel" aria-labelledby="account-tab">
				<div class="row">
					<div class="col-12 col-md-8">
						<div class="d-flex justify-content-between">
							<h5 class="text-capitalize">{{ $t("labels.email") }}</h5>
							<div>{{ userStore.email }}</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-12 col-md-8">
						<div class="d-flex justify-content-between align-items-center">
							<h5 class="text-capitalize m-0">{{ $t("labels.password") }}</h5>
							<button type="button" data-bs-toggle="modal" data-bs-target="#passwordChangingModal"
								class="btn btn-primary text-capitalize">{{ $t("labels.change") }}</button>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
				<div class="row mb-3">
					<div class="col-12 col-md-8">
						<div class="d-flex justify-content-between">
							<h5 class="text-capitalize m-0">{{ $t("labels.avatar") }}</h5>
							<div class="d-flex align-items-start">
								<img :src="userStore.avatar" alt="avatar" width="100" height="100"
									class="me-2 rounded-circle" ref="avatarRef">
								<button type="button" class="btn btn-primary text-capitalize"
									v-show="!inputs2.avatar.isShowInput" @click="uploadAvatar()"
									:title="$t('messages.edit')">
									<i class="bi bi-pencil-square"></i>
								</button>
							</div>
						</div>
						<div class="text-end mt-2" v-show="inputs2.avatar.isShowInput">
							<input type="file" class="d-none" :class="{ 'is-invalid': inputs2.avatar.isInvalid }"
								@change="previewAvatar" ref="avatarInputRef" accept="image/png, image/jpeg" />
							<div class="invalid-feedback mb-2">{{ inputs2.avatar.errMsg }}</div>
							<button class="btn btn btn-light text-capitalize me-2" :disabled="isSubmitting"
								@click="cancelUpdateAccInfo('avatar')">
								{{ $t("labels.cancel") }}
							</button>
							<SubmitBtnComponent @submit="update('avatar')" :isDisabled="isSubmitting"
								class="text-capitalize">
								{{ $t("labels.save") }}
							</SubmitBtnComponent>
						</div>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12 col-md-8">
						<div class="d-flex justify-content-between align-items-center">
							<h5 class="text-capitalize m-0">{{ $t("labels.displayName") }}</h5>
							<div v-show="!inputs2.display_name.isShowInput">
								<span class="me-2">{{ userStore.display_name }}</span>
								<button type="button" class="btn btn-primary text-capitalize"
									@click="inputs2.display_name.isShowInput = true" :title="$t('messages.edit')">
									<i class="bi bi-pencil-square"></i>
								</button>
							</div>
							<div class="ms-3 flex-grow-1" v-show="inputs2.display_name.isShowInput">
								<input type="text" class="form-control"
									:class="{ 'is-invalid': inputs2.display_name.isInvalid }"
									v-model="inputs2.display_name.val">
							</div>
						</div>
						<div class="text-end mt-2" v-show="inputs2.display_name.isShowInput">
							<input type="hidden" :class="{ 'is-invalid': inputs2.display_name.isInvalid }">
							<div class="invalid-feedback mb-2">{{ inputs2.display_name.errMsg }}</div>
							<button class="btn btn btn-light text-capitalize me-2" :disabled="isSubmitting"
								@click="cancelUpdateAccInfo('display_name')">
								{{ $t("labels.cancel") }}
							</button>
							<SubmitBtnComponent @submit="update('display_name')" :isDisabled="isSubmitting"
								class="text-capitalize">
								{{ $t("labels.save") }}
							</SubmitBtnComponent>
						</div>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12 col-md-8">
						<div class="d-flex justify-content-between align-items-center">
							<h5 class="text-capitalize m-0">{{ $t("labels.gender") }}</h5>
							<div v-show="!isShowGenderInput">
								<span class="me-2 text-capitalize" v-if="$i18n.locale == 'en'">{{ genderStage }}</span>
								<span class="me-2 text-capitalize" v-if="$i18n.locale == 'vi'">{{ genderStageVi
									}}</span>
								<button type="button" class="btn btn-primary text-capitalize"
									@click="isShowGenderInput = !isShowGenderInput" :title="$t('messages.edit')">
									<i class="bi bi-pencil-square"></i>
								</button>
							</div>
							<div class="ms-3 flex-grow-1" v-show="isShowGenderInput">
								<div class="d-flex justify-content-end">
									<select ref="genderSelectRef" class="form-select text-capitalize w-200px"
										v-model="genderInput">
										<option :value="item.id" v-for="item in genderList" v-if="$i18n.locale == 'en'">
											{{ item.name }}</option>
										<option :value="item.id" v-for="item in genderList" v-if="$i18n.locale == 'vi'">
											{{ item.name_vi }}</option>
									</select>
								</div>
							</div>
						</div>
						<div class="text-end mt-2" v-show="isShowGenderInput">
							<button class="btn btn btn-light text-capitalize me-2"
								@click="isShowGenderInput = false">cancel</button>
							<button class="btn btn btn-primary text-capitalize">save</button>
						</div>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12 col-md-8">
						<div class="d-flex justify-content-between align-items-center">
							<h5 class="text-capitalize m-0">{{ $t("labels.location") }}</h5>
							<div v-show="!isShowLocationInput">
								<span class="me-2 text-capitalize" v-if="$i18n.locale == 'en'">{{ locationStage
									}}</span>
								<span class="me-2 text-capitalize" v-if="$i18n.locale == 'vi'">{{ locationStageVi
									}}</span>
								<button type="button" class="btn btn-primary text-capitalize"
									@click="isShowLocationInput = !isShowLocationInput" :title="$t('messages.edit')">
									<i class="bi bi-pencil-square"></i>
								</button>
							</div>
							<div class="ms-3 flex-grow-1" v-show="isShowLocationInput">
								<div class="d-flex justify-content-end">
									<select ref="locationSelectRef" class="form-select text-capitalize w-200px"
										v-model="locationInput">
										<option :value="item.id" v-for="item in locationList"
											v-if="$i18n.locale == 'en'">
											{{ item.name }}</option>
										<option :value="item.id" v-for="item in locationList"
											v-if="$i18n.locale == 'vi'">
											{{ item.name_vi }}</option>
									</select>
								</div>
							</div>
						</div>
						<div class="text-end mt-2" v-show="isShowLocationInput">
							<button class="btn btn btn-light text-capitalize me-2"
								@click="isShowLocationInput = false">cancel</button>
							<button class="btn btn btn-primary text-capitalize">save</button>
						</div>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12 col-md-8">
						<div class="d-flex justify-content-between align-items-center">
							<h5 class="text-capitalize m-0">{{ $t("labels.aboutDescription") }}</h5>
							<div>
								<span class="me-2">{{ userStore.description }}</span>
								<button type="button" class="btn btn-primary text-capitalize"
									:title="$t('messages.edit')">
									<i class="bi bi-pencil-square"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
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
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
						{{ $t("labels.cancel") }}
					</button>
					<SubmitBtnComponent @submit="submitChangePassword" :isDisabled="isSubmitting"
						class="text-capitalize">
						{{ $t("labels.change") }}
					</SubmitBtnComponent>
				</div>
			</div>
		</div>
	</div>
</template>