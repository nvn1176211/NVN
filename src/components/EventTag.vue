<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import SubmitBtnComponent from './partials/SubmitBtn.vue';
import ToggleBtnComponent from './partials/ToggleBtn.vue';
import VotesComponent from './partials/Votes.vue';
import { useUserStore } from '../stores/UserStore';

const userStore = useUserStore();
const route = useRoute();
const events = ref([]);
const tag_id = route.params.id;
const event_tag_name = ref(null);
const isDisabledBtn = ref(false);
const activePageIndex = ref(0);
const isLoadingSpinActive = ref(true);
let removeConfirmModal = null;
onMounted(async () => {
    removeConfirmModal = new bootstrap.Modal(document.getElementById('removeConfirmModal'), {
        keyboard: false
    })
    let api_token = getCookie('api_token') ?? '';
    await fetch(`${API_BASE}/event_tags/${tag_id}?api_token=${api_token}`)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            events.value = json.events;
            event_tag_name.value = json.event_tag.name;
            isLoadingSpinActive.value = false;
        });
})
async function download_thumbnail(event_thumbnail_url) {
    const response = await fetch(event_thumbnail_url);
    const blobImage = await response.blob();
    const href = URL.createObjectURL(blobImage);
    const anchorElement = document.createElement('a');
    anchorElement.href = href;
    anchorElement.download = 'thumbnal.jpg';
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
    URL.revokeObjectURL(href);
}
async function removePage() {
    // isDisabledBtn.value = true;
    // let api_token = getCookie('api_token');
    // const response = await fetch(`${API_BASE}/events/${tag_id}/delete?api_token=${api_token}`);
    // switch (response.status) {
    //     case 200:
    //         removeConfirmModal.hide();
    //         alert(t("messages.eventPageDeleted"));
    //         router.push('/');
    //         break;
    //     case 403:
    //         removeConfirmModal.hide();
    //         alert(t("messages.forbidDeleteLastPage"));
    //         break;
    //     default:
    //         removeConfirmModal.hide();
    //         alert(t("messages.somethingWrong"));
    // }
    // isDisabledBtn.value = false;
}
function togglePage(index) {
    activePageIndex.value = activePageIndex.value == index ? -1 : index;
}
</script>

<template>
    <div class="d-flex justify-content-center" v-if="isLoadingSpinActive">
        <span class="spinner-border spinner-border-sm tag-search-spin" role="status" aria-hidden="true"></span>
    </div>
    <div v-show="!isLoadingSpinActive">
        <div class="mb-5">
            <div class="mb-4">
                <div id="title-block" class="d-flex justify-content-between align-items-center">
                    <h2>{{ event_tag_name }}</h2>
                    <button v-if="userStore.isAdmin" class="btn btn-danger" data-bs-toggle="modal"
                        data-bs-target="#removeConfirmModal" id="removeEventPageBtn"><i class="bi bi-trash"></i></button>
                </div>
                <hr class="mt-2 mb-0">
            </div>
        </div>
        <div>
            <div>
                <div v-for="(event, index) in events" class="mb-4" :class="{ 'cursor-pointer': index != activePageIndex }">
                    <div class="event card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-12 col-md-6">
                                    <div class="d-flex">
                                        <div class="d-flex flex-column align-items-center me-3">
                                            <ToggleBtnComponent :target="index" :activeTargetIndex="activePageIndex"
                                                @toggle="togglePage(index)"></ToggleBtnComponent>
                                        </div>
                                        <div>
                                            <div>
                                                <div>By {{ event.author_name }}</div>
                                                <div>Created {{ event.f1_created_at }}</div>
                                                <VotesComponent :event_id="event.id" :votes="event.votes"
                                                    :voted="event.voted == 'yes' ? true : false"></VotesComponent>
                                            </div>
                                            <div v-show="index == activePageIndex">
                                                <hr>
                                                {{ event.content }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6" v-show="index == activePageIndex">
                                    <div class="position-relative p-2 border" id="thumbnail-block">
                                        <img :src="event.thumbnail" alt="" width="100%" height="auto">
                                        <a class="bg-white position-absolute end-0 bottom-0 p-2 download-btn"
                                            href="javascript:void(0)" :data-href="event.thumbnail"
                                            @click="download_thumbnail(event.thumbnail)">
                                            <i class="bi bi-download"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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