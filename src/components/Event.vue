<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import SubmitBtnComponent from './partials/SubmitBtn.vue';
import { useUserStore } from '../stores/UserStore';
import { useI18n } from "vue-i18n";
import { useRouter } from 'vue-router';

const router = useRouter();
const { t } = useI18n();
const userStore = useUserStore();
const route = useRoute();
const event_id = route.params.id;
const event_name = ref(null);
const event_content = ref(null);
const event_thumbnail = ref(null);
const event_created_at = ref(null);
const event_created_by = ref(null);
const event_another_version = ref([]);
const avClass = ref(null);
const isDisabledBtn = ref(false);
let removeConfirmModal = null;
onMounted(async () => {
    removeConfirmModal = new bootstrap.Modal(document.getElementById('removeConfirmModal'), {
        keyboard: false
    })

    await fetch(`${API_BASE}/events/${event_id}`)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            let event = json.event;
            event_name.value = event.name;
            event_content.value = event.content;
            event_thumbnail.value = event.thumbnail;
            event_created_at.value = event.f1_created_at;
            event_created_by.value = event.created_by;
            event_another_version.value = json.another_version;
            avClass.value = event_another_version.value.length > 0 ? '' : 'd-none';
        });
})
async function download_thumbnail(event_thumbnail) {
    const response = await fetch(event_thumbnail);
    const blobImage = await response.blob();
    const href = URL.createObjectURL(blobImage);
    const anchorElement = document.createElement('a');
    anchorElement.href = href;
    anchorElement.download = 'thumbnal.png';
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
    URL.revokeObjectURL(href);
}
async function removePage() {
    isDisabledBtn.value = true;
    let api_token = getCookie('api_token');
    const response = await fetch(`${API_BASE}/events/${event_id}/delete?api_token=${api_token}`);
    switch (response.status) {
        case 200:
            removeConfirmModal.hide();
            alert(t("messages.eventPageDeleted"));
            router.push('/');
            break;
        case 403:
            removeConfirmModal.hide();
            alert(t("messages.forbidDeleteLastPage"));
            break;
        default:
            removeConfirmModal.hide();
            alert(t("messages.somethingWrong"));
    }
    isDisabledBtn.value = false;
}
</script>

<template>
    <div class="mb-5">
        <div class="mb-4">
            <div id="title-block" class="d-flex justify-content-between align-items-center">
                <h2>{{ event_name }}</h2>
                <button v-if="userStore.isAdmin" class="btn btn-danger" data-bs-toggle="modal"
                    data-bs-target="#removeConfirmModal" id="removeEventPageBtn"><i class="bi bi-trash"></i></button>
            </div>
            <hr class="mt-2 mb-0">
        </div>
        <div class="row">
            <div class="col-12 col-md-6">
                <div>
                    <div>By {{ event_created_by }}</div>
                    <div>Created {{ event_created_at }}</div>
                </div>
                <hr>
                <div>
                    {{ event_content }}
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="position-relative p-2 border" id="thumbnail-block">
                    <img :src="event_thumbnail" alt="" width="100%" height="auto">
                    <a class="bg-white position-absolute end-0 bottom-0 p-2 download-btn" href="javascript:void(0)"
                        :data-href="event_thumbnail" @click="download_thumbnail(event_thumbnail)">
                        <i class="bi bi-download"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div :class="avClass">
        <h6>Edit History</h6>
        <hr class="mt-2 mb-2">
        <div>
            <ul id="event-edit-history-ul">
                <li>
                    <router-link :to="`/events/${event_id}`">Created at: {{ event_created_at }} - Created by: {{
                        event_created_by }}</router-link>
                </li>
                <li v-for="item in event_another_version">
                    <router-link :to="`/events/other_version/${item.id}`">Created at: {{
                        item.f1_created_at }} - Created by: {{ item.created_by }}</router-link>
                </li>
            </ul>
        </div>
    </div>
    <div class="modal fade" id="removeConfirmModal" tabindex="-1" aria-labelledby="removeConfirmModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <h5 class="modal-title text-center" id="removeConfirmModalLabel">{{ $t("messages.areYouSure") }}</h5>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary text-capitalize" data-bs-dismiss="modal">{{
                        $t("labels.no") }}</button>
                    <SubmitBtnComponent @submit="removePage" :isDisabled="isDisabledBtn" class="text-capitalize">{{
                        $t("labels.yes") }}</SubmitBtnComponent>
                </div>
            </div>
        </div>
    </div>
</template>