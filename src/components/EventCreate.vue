<script setup>
import { reactive } from 'vue';
const input = reactive({
    tag: {
        errMsg: null,
        isInvalid: false,
        val: null,
        options: [],
    },
    startDate: {
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
</script>

<template>
    <form id="CreatePageForm">
        <div class="row">
            <div class="col-12 col-md-6">
                <div class="mb-3 mt-3">
                    <label for="tag" class="form-label">Tag:</label>
                    <select :class="{ 'is-invalid': input.tag.isInvalid }" v-model="input.tag.val" id="tag"
                        class="form-select" name="tag">
                        <option value="{{ option.id }}" v-for="option in input.tag.options">{{ option.name }}</option>
                    </select>
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="mb-3 mt-3">
                    <label for="startDate" class="form-label text-capitalize">{{ $t('labels.startDate') }}:</label>
                    <input :class="{ 'is-invalid': input.startDate.isInvalid }" v-model="input.startDate.val"
                        class="form-control" type="datetime-local" name="startDate" autocomplete="off">
                    <div class="invalid-feedback">{{ input.startDate.errMsg }}</div>
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="mb-3 mt-3">
                    <label for="thumbnail" class="form-label text-capitalize">{{ $t('labels.thumbnail') }}:</label>
                    <input :class="{ 'is-invalid': input.thumbnail.isInvalid }" type="file" id="thumbnail" name="thumbnail"
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
            <button class="btn btn-primary text-capitalize" type="button" id="submitCreatePageBtn">{{ $t('labels.create')
                            }}</button>
        </div>
</form></template>