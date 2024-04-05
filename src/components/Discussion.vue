<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import SubmitBtnComponent from './partials/SubmitBtn.vue';
import ToggleBtnComponent from './partials/ToggleBtn.vue';
import VotesComponent from './partials/Votes.vue';
import ChatsOverviewComponent from './partials/ChatsOverview.vue';
import OpinionCKEditorComponent from './partials/OpinionCKEditor.vue';
import { useUserStore } from '../stores/UserStore';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStore();
const route = useRoute();
const discussion_id = route.params.id;
const discussionName = ref(null);
const discussionContentRef = ref(null);
const discussionVotes = ref(0);
const discussionVoted = ref('no');
const discussionAuthorName = ref(null);
const discussionCreatedAt = ref(null);
const opinions = ref([]);
const isDisabledBtn = ref(false);
const activePageIndex = ref(0);
const isLoadingSpinActive = ref(true);
const isShowOpinionCompose = ref(false);
const isSaveOpinionLoading = ref(false);
const opinionCKEditorComponentRef = ref(null);
const inputs = reactive({
    content: {
        errMsg: null,
        isInvalid: false,
        val: '',
    },
});
let removeConfirmModal = null;
let pendingRemoveId = null;
onMounted(async () => {
    removeConfirmModal = new bootstrap.Modal(document.getElementById('removeConfirmModal'), {
        keyboard: false
    })
    let api_token = helpers.getCookie('api_token') ?? '';
    await fetch(`${DISCUSSIONS_API}/${discussion_id}?api_token=${api_token}`)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            discussionName.value = json.discussion.name;
            discussionContentRef.value.innerHTML = json.discussion.content;
            discussionVotes.value = json.discussion.votes;
            discussionVoted.value = json.discussion.voted;
            discussionAuthorName.value = json.discussion.author_name;
            discussionCreatedAt.value = json.discussion.f1_created_at;
            opinions.value = json.opinions;
            isLoadingSpinActive.value = false;
        });
})
function addOpinion() {
    if (!userStore.isLoggedIn) {
        loginRquiredModal.show();
        return false;
    }
    isShowOpinionCompose.value = true;
}
function closeOpinionCompose() {
    isShowOpinionCompose.value = false;
}
async function saveOpinion() {
    helpers.refreshFormErrInput(inputs);
    isSaveOpinionLoading.value = true;
    let formdata = new FormData();
    let api_token = helpers.getCookie('api_token');
    inputs.content.val = opinionCKEditorComponentRef.value.content;
    formdata.append("discussion_id", discussion_id);
    if (api_token) formdata.append("api_token", api_token);
    if (inputs.content.val) formdata.append("content", inputs.content.val);
    const response = await fetch(OPINIONS_CREATION_API, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
        },
        body: formdata
    });
    const resBodyObj = await response.json();
    switch (response.status) {
        case 422:
            helpers.handleInvalidInput(resBodyObj, inputs, ['discussion_id'], ['content']);
            isSaveOpinionLoading.value = false;
            break;
        case 201:
            closeOpinionCompose();
            isSaveOpinionLoading.value = false;
            opinionCKEditorComponentRef.value.setData('');
            opinions.value.push(resBodyObj);
            activePageIndex.value = opinions.value.length - 1;
            setTimeout(function(){
                document.getElementById(`opinion-${activePageIndex.value}`).scrollIntoView();
            }, 300);
            sessionStorage.toastMsg = t("messages.successCreateOpinion")
            userStore.recentTriggerToast = Date.now()
            break;
        default:
            console.log(t("messages.somethingWrong"));
            isSaveOpinionLoading.value = false;
    }
}
async function download_thumbnail(event_thumbnail_url) {
    // const response = await fetch(event_thumbnail_url);
    // const blobImage = await response.blob();
    // const href = URL.createObjectURL(blobImage);
    // const anchorElement = document.createElement('a');
    // anchorElement.href = href;
    // anchorElement.download = 'thumbnal.jpg';
    // document.body.appendChild(anchorElement);
    // anchorElement.click();
    // document.body.removeChild(anchorElement);
    // URL.revokeObjectURL(href);
}
async function removePage() {
    // isDisabledBtn.value = true;
    // let api_token = helpers.getCookie('api_token');
    // const response = await fetch(`${API_BASE}/events/${pendingRemoveId}/delete?api_token=${api_token}`);
    // switch (response.status) {
    //     case 200:
    //         removeConfirmModal.hide();
    //         alert(t("messages.eventPageDeleted"));
    //         router.push('/');
    //         break;
    //     default:
    //         removeConfirmModal.hide();
    //         alert(t("messages.somethingWrong"));
    // }
    // isDisabledBtn.value = false;
}
function confirmRemove(id) {
    pendingRemoveId = id;
    removeConfirmModal.show();
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
            <div>
                <div id="title-block" class="d-flex justify-content-between align-items-center">
                    <h2>{{ discussionName }}</h2>
                    <button v-if="userStore.isAdmin" @click="confirmRemove(discussion_id)" class="btn btn-danger"><i
                            class="bi bi-trash"></i></button>
                </div>
                <div class="mb-2">
                    <div>By {{ discussionAuthorName }}</div>
                    <div>Created {{ discussionCreatedAt }}</div>
                </div>
                <div class="mb-4 d-flex">
                    <VotesComponent :sector="'discussion_votes'" :id="discussion_id" :votes="discussionVotes"
                        :voted="discussionVoted == 'yes' ? true : false"></VotesComponent>
                    <ChatsOverviewComponent :numberOfOpinions="opinions.length" class="ms-2"></ChatsOverviewComponent>
                </div>
                <div class="ck-content" ref="discussionContentRef"></div>
            </div>
        </div>
        <div class="mb-5">
            <div v-show="!isShowOpinionCompose">
                <button class="btn btn-primary" @click="addOpinion">{{ $t("messages.addAOpinion") }}</button>
            </div>
            <div class="border rounded" v-show="isShowOpinionCompose">
                <OpinionCKEditorComponent ref="opinionCKEditorComponentRef" :name="'content'" :isInvalid="inputs.content.isInvalid" :errMsg="inputs.content.errMsg" />
                <div class="p-2 d-flex justify-content-end">
                    <button class="btn btn-secondary me-2" @click="closeOpinionCompose">{{ $t("labels.close")
                        }}</button>
                    <button class="btn btn-primary" @click="saveOpinion" :disabled="isSaveOpinionLoading">
                        <span v-show="isSaveOpinionLoading" class="spinner-border spinner-border-sm" role="status"
                            aria-hidden="true"></span>
                        {{ $t("labels.save") }}
                    </button>
                </div>
            </div>
        </div>
        <div>
            <div>
                <div v-for="(opinion, index) in opinions" class="mb-4" :id="`opinion-${index}`">
                    <div class="event card">
                        <div class="card-body">
                            <div class="d-flex">
                                <div class="d-flex flex-column align-items-center me-3">
                                    <ToggleBtnComponent :target="index" :activeTargetIndex="activePageIndex"
                                        @toggle="togglePage(index)"></ToggleBtnComponent>
                                    <button v-if="userStore.isAdmin" @click="confirmRemove(opinion.id)"
                                        class="btn btn-danger mt-3"><i class="bi bi-trash"></i></button>
                                </div>
                                <div class="flex-grow-1">
                                    <div>
                                        <div>By {{ opinion.author_name }}</div>
                                        <div>Created {{ opinion.f1_created_at }}</div>
                                        <div class="mt-2">
                                            <VotesComponent :sector="'opinion_votes'" :id="opinion.id"
                                                :votes="opinion.votes" :voted="opinion.voted == 'yes' ? true : false">
                                            </VotesComponent>
                                        </div>
                                    </div>
                                    <div v-show="index == activePageIndex">
                                        <hr>
                                        <div class="ck-content" v-html="opinion.content"></div>
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
                    <h5 class="modal-title text-center" id="removeConfirmModalLabel">{{ $t("messages.areYouSure") }}
                    </h5>
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
    <!-- <LoginRequiredModalComponent ref="loginRequiredModalRef" /> -->
</template>