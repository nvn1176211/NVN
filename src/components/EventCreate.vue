<script setup>
import { ref, onMounted, reactive } from 'vue';
import SubmitBtnComponent from './partials/SubmitBtn.vue';
import { useI18n } from "vue-i18n";
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();
const thumbnail = ref(null);
const pageCreationInput = reactive({
    tag: {
        errMsg: null,
        isInvalid: false,
        val: null,
        options: [],
    },
    datetime: {
        errMsg: null,
        isInvalid: false,
        val: null,
    },
    thumbnail: {
        errMsg: null,
        isInvalid: false,
        val: null,
    },
    content: {
        errMsg: null,
        isInvalid: false,
        val: null,
    },
});
const tagCreationInput = reactive({
    name: {
        errMsg: null,
        isInvalid: false,
        val: null,
    },
});
const isDisabledBtn = ref(false);
onMounted(async () => {
    const response = await fetch(`${API_BASE}/simple_event_tags`);
    const resBodyObj = await response.json();
    pageCreationInput.tag.options = resBodyObj.eventTags;
});
async function submitPageCreation() {
    refreshFormErrInput(pageCreationInput);
    isDisabledBtn.value = true;
    let formdata = new FormData();
    let api_token = getCookie('api_token');
    if (api_token) formdata.append("api_token", api_token);
    if (thumbnail.value.files[0]) formdata.append("thumbnail", thumbnail.value.files[0]);
    if (pageCreationInput.tag.val) formdata.append("tag", pageCreationInput.tag.val);
    if (pageCreationInput.datetime.val) formdata.append("datetime", pageCreationInput.datetime.val);
    if (pageCreationInput.content.val) formdata.append("content", pageCreationInput.content.val);
    const response = await fetch(`${API_BASE}/events`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
        },
        body: formdata
    });
    const resBodyObj = await response.json();
    switch (response.status) {
        case 422:
            handleInvalidInput(resBodyObj, pageCreationInput);
            break;
        case 201:
            alert(t("messages.successCreateEventPage"));
            router.push('/');
            break;
    }
    isDisabledBtn.value = false;
}
async function submitTagCreation() {
    refreshFormErrInput(tagCreationInput);
    isDisabledBtn.value = true;
    let formdata = new FormData();
    let api_token = getCookie('api_token');
    if (api_token) formdata.append("api_token", api_token);
    if (tagCreationInput.name.val) formdata.append("name", tagCreationInput.name.val);
    const response = await fetch(`${API_BASE}/event_tags`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
        },
        body: formdata
    });
    const resBodyObj = await response.json();
    switch (response.status) {
        case 422:
            handleInvalidInput(resBodyObj, tagCreationInput);
            break;
        case 201:
            alert(t("messages.successCreateEventTag"));
            router.push('/');
            break;
        default:
            removeConfirmModal.hide();
            alert(t("messages.somethingWrong"));
    }
    isDisabledBtn.value = false;
}
</script>

<template>
    <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <button class="nav-link active" id="nav-page-tab" data-bs-toggle="tab" data-bs-target="#page-home" type="button"
                role="tab" aria-controls="page-home" aria-selected="true">Page Creation</button>
            <button class="nav-link" id="nav-tag-tab" data-bs-toggle="tab" data-bs-target="#nav-tag" type="button"
                role="tab" aria-controls="nav-tag" aria-selected="false">Tag Creation</button>
        </div>
    </nav>
    <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="page-home" role="tabpanel" aria-labelledby="nav-page-tab">
            <form id="CreatePageForm">
                <div class="row">
                    <div class="col-12 col-md-6">
                        <div class="mb-3 mt-3">
                            <label for="tag" class="form-label text-capitalize">{{ $t('labels.tag') }}:</label>
                            <select :class="{ 'is-invalid': pageCreationInput.tag.isInvalid }" v-model="pageCreationInput.tag.val" id="tag"
                                class="form-select" name="tag">
                                <option :value="option.id" v-for="option in pageCreationInput.tag.options">{{ option.name }}</option>
                            </select>
                            <div class="invalid-feedback">{{ pageCreationInput.tag.errMsg }}</div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="mb-3 mt-3">
                            <label for="datetime" class="form-label text-capitalize">{{ $t('labels.startDate') }}:</label>
                            <input :class="{ 'is-invalid': pageCreationInput.datetime.isInvalid }" v-model="pageCreationInput.datetime.val"
                                class="form-control" type="datetime-local" name="datetime" id="datetime" autocomplete="off">
                            <div class="invalid-feedback">{{ pageCreationInput.datetime.errMsg }}</div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="mb-3 mt-3">
                            <label for="thumbnail" class="form-label text-capitalize">{{ $t('labels.thumbnail') }}:</label>
                            <input :class="{ 'is-invalid': pageCreationInput.thumbnail.isInvalid }" ref="thumbnail" type="file"
                                id="thumbnail" name="thumbnail" class="form-control" accept="image/*">
                            <div class="invalid-feedback">{{ pageCreationInput.thumbnail.errMsg }}</div>
                        </div>
                    </div>
                </div>
                <div class="mb-3 mt-3">
                    <label for="content" class="form-label text-capitalize">{{ $t('labels.content') }}:</label>
                    <textarea :class="{ 'is-invalid': pageCreationInput.content.isInvalid }" v-model="pageCreationInput.content.val" id="content"
                        class="form-control" cols="30" rows="10" name="content" autocomplete="off"></textarea>
                    <div class="invalid-feedback">{{ pageCreationInput.content.errMsg }}</div>
                </div>
                <div class="d-flex justify-content-end">
                    <SubmitBtnComponent @submit="submitPageCreation" :isDisabled="isDisabledBtn" class="text-capitalize">{{
                        $t('labels.create') }}</SubmitBtnComponent>
                </div>
            </form>
        </div>
        <div class="tab-pane fade" id="nav-tag" role="tabpanel" aria-labelledby="nav-tag-tab">
            <form id="CreateTagForm">
                <div class="row">
                    <div class="col-12 col-md-6">
                        <div class="mb-3 mt-3">
                            <label for="tag" class="form-label text-capitalize">{{ $t('labels.tagName') }}:</label>
                            <input id="tagName" :class="{ 'is-invalid': tagCreationInput.name.isInvalid }" class="form-control"
                            v-model="tagCreationInput.name.val" type="text" name="tagName" autocomplete="off">
                            <div class="invalid-feedback">{{ tagCreationInput.name.errMsg }}</div>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-end">
                    <SubmitBtnComponent @submit="submitTagCreation" :isDisabled="isDisabledBtn" class="text-capitalize">{{
                        $t('labels.create') }}</SubmitBtnComponent>
                </div>
            </form>
        </div>
    </div>
</template>