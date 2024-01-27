<script setup>
import { ref, onMounted, reactive } from 'vue';
import SubmitBtnComponent from './partials/SubmitBtn.vue';
import { useI18n } from "vue-i18n";
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();
const thumbnail = ref(null);
const input = reactive({
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
const isDisabledBtn = ref(false);
onMounted(async () => {
    const response = await fetch('https://nvn1.000webhostapp.com/api/event_tags');
    const resBodyObj = await response.json();
    input.tag.options = resBodyObj.event_tags;
});
async function submit(){
    refreshFormErrInput(input);
    isDisabledBtn.value = true;
    let formdata = new FormData();
    let api_token = getCookie('api_token');
    if (api_token) formdata.append("api_token", api_token);
    if (thumbnail.value.files[0]) formdata.append("thumbnail", thumbnail.value.files[0]);
    if (input.tag.val) formdata.append("tag", input.tag.val);
    if (input.datetime.val) formdata.append("datetime", input.datetime.val);
    if (input.content.val) formdata.append("content", input.content.val);
    const response = await fetch('https://nvn1.000webhostapp.com/api/events', {
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
        case 201:
            alert(t("messages.successCreateEventPage"));
            router.push('/');
            break;
    }
    isDisabledBtn.value = false;
}
</script>

<template>
    <form id="CreatePageForm">
        <div class="row">
            <div class="col-12 col-md-6">
                <div class="mb-3 mt-3">
                    <label for="tag" class="form-label">Tag:</label>
                    <select :class="{ 'is-invalid': input.tag.isInvalid }" v-model="input.tag.val" id="tag"
                        class="form-select" name="tag">
                        <option :value="option.id" v-for="option in input.tag.options">{{ option.name }}</option>
                    </select>
                    <div class="invalid-feedback">{{ input.tag.errMsg }}</div>
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="mb-3 mt-3">
                    <label for="datetime" class="form-label text-capitalize">{{ $t('labels.startDate') }}:</label>
                    <input :class="{ 'is-invalid': input.datetime.isInvalid }" v-model="input.datetime.val"
                        class="form-control" type="datetime-local" name="datetime" id="datetime" autocomplete="off">
                    <div class="invalid-feedback">{{ input.datetime.errMsg }}</div>
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="mb-3 mt-3">
                    <label for="thumbnail" class="form-label text-capitalize">{{ $t('labels.thumbnail') }}:</label>
                    <input :class="{ 'is-invalid': input.thumbnail.isInvalid }" ref="thumbnail" type="file" id="thumbnail" name="thumbnail"
                        class="form-control" accept="image/*">
                    <div class="invalid-feedback">{{ input.thumbnail.errMsg }}</div>
                </div>
            </div>
        </div>
        <div class="mb-3 mt-3">
            <label for="content" class="form-label text-capitalize">{{ $t('labels.content') }}:</label>
            <textarea :class="{ 'is-invalid': input.content.isInvalid }" v-model="input.content.val" id="content"
                class="form-control" cols="30" rows="10" name="content" autocomplete="off"></textarea>
            <div class="invalid-feedback">{{ input.content.errMsg }}</div>
        </div>
        <div class="d-flex justify-content-end">
            <SubmitBtnComponent @submit="submit" :isDisabled="isDisabledBtn" class="text-capitalize">{{
                $t('labels.create') }}</SubmitBtnComponent>
        </div>
    </form>
</template>