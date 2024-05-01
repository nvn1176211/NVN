<script setup>
import { ref, reactive } from 'vue';
import SubmitBtnComponent from './partials/SubmitBtn.vue';
import PageCKEditorComponent from './partials/PageCKEditor.vue';
import { useI18n } from "vue-i18n";
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/UserStore';

const userStore = useUserStore();
const { t } = useI18n();
const router = useRouter();
const thumbnail = ref(null);
const pageTypes = env.PAGE_TYPES;
const typeInput = ref(pageTypes.ARTICLES);
const pageCKEditorComponentRef = ref(null);
const inputs = reactive({
    thumbnail: {
        errMsg: null,
        isInvalid: false,
        val: null,
    },
    content: {
        errMsg: null,
        isInvalid: false,
        val: '',
    },
    name: {
        errMsg: null,
        isInvalid: false,
        val: null,
    },
});
const isDisabledBtn = ref(false);
async function submitPageCreation() {
    helpers.refreshFormErrInput(inputs);
    isDisabledBtn.value = true;
    let formdata = new FormData();
    let api_token = helpers.getCookie('api_token');
    let successMsg;
    inputs.content.val = pageCKEditorComponentRef.value.content;
    if (api_token) formdata.append("api_token", api_token);
    if (thumbnail.value.files[0]) formdata.append("thumbnail", thumbnail.value.files[0]);
    if (inputs.content.val) formdata.append("content", inputs.content.val);
    if (inputs.name.val) formdata.append("name", inputs.name.val);
    let api_route;
    switch (typeInput.value) {
        case pageTypes.ARTICLES:
            api_route = env.ARTICLES_CREATION_API;
            successMsg = t("messages.successCreateArticle");
            break;
        case pageTypes.DISCUSSIONS:
            api_route = env.DISCUSSIONS_CREATION_API;
            successMsg = t("messages.successCreateDiscussion");
            break;
    }
    const response = await fetch(api_route, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
        },
        body: formdata
    });
    const resBodyObj = await response.json();
    switch (response.status) {
        case 422:
            helpers.handleInvalidInput(resBodyObj, inputs, [], ['content']);
            isDisabledBtn.value = false;
            break;
        case 201:
            isDisabledBtn.value = false;
            sessionStorage.toastMsg = successMsg
            userStore.recentTriggerToast = Date.now()
            router.push('/');
            break;
        default:
            console.error(t("messages.somethingWrong"));
            isDisabledBtn.value = false;
    }
}
</script>

<template>
    <form>
        <div class="row">
            <div class="col-12 col-md-6">
                <div class="mb-3 mt-3">
                    <label for="type" class="form-label text-capitalize">{{ $t('labels.type') }}:</label>
                    <select id="type" name="type" v-model="typeInput" class="form-select text-capitalize">
                        <option :value="pageType" v-for="pageType in pageTypes">{{ pageType }}</option>
                    </select>
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="mb-3 mt-3">
                    <label for="name" class="form-label text-capitalize">{{ $t('labels.name') }}:</label>
                    <input :class="{ 'is-invalid': inputs.name.isInvalid }" ref="name" type="text"
                        v-model="inputs.name.val" id="name" name="name" class="form-control">
                    <div class="invalid-feedback">{{ inputs.name.errMsg }}</div>
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="mb-3 mt-3">
                    <label for="thumbnail" class="form-label text-capitalize">{{ $t('labels.thumbnail') }}:</label>
                    <input :class="{ 'is-invalid': inputs.thumbnail.isInvalid }" ref="thumbnail" type="file"
                        id="thumbnail" name="thumbnail" class="form-control" accept="image/*">
                    <div class="invalid-feedback">{{ inputs.thumbnail.errMsg }}</div>
                </div>
            </div>
        </div>
        <div class="mb-3 mt-3">
            <label for="content" class="form-label text-capitalize">{{ $t('labels.content') }}:</label>
            <PageCKEditorComponent ref="pageCKEditorComponentRef" :name="'content'" :isInvalid="inputs.content.isInvalid" :errMsg="inputs.content.errMsg" />
        </div>
        <div class="d-flex justify-content-end">
            <SubmitBtnComponent @submit="submitPageCreation" :isDisabled="isDisabledBtn" class="text-capitalize">{{
                        $t('labels.create') }}</SubmitBtnComponent>
        </div>
    </form>
</template>