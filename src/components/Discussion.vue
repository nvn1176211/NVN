<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import SubmitBtnComponent from './partials/SubmitBtn.vue';
import ToggleBtnComponent from './partials/ToggleBtn.vue';
import VotesComponent from './partials/Votes.vue';
import ChatsOverviewComponent from './partials/ChatsOverview.vue';
import OpinionCKEditorComponent from './partials/OpinionCKEditor.vue';
import OtherActionsComponent from './partials/OtherActions.vue';
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
let removeConfirmModal = null;
let pendingRemoveId = null;
onMounted(async () => {
    removeConfirmModal = new bootstrap.Modal(document.getElementById('removeConfirmModal'), {
        keyboard: false
    })
    let api_token = helpers.getCookie('api_token') ?? '';
    await fetch(`${env.DISCUSSIONS_API}/${discussion_id}?api_token=${api_token}`)
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
function showOpinionContent(id) {
    document.getElementById(id).classList.remove('d-none');
}
async function removePage() {
    // isDisabledBtn.value = true;
    // let api_token = helpers.getCookie('api_token');
    // const response = await fetch(`${env.API_BASE}/events/${pendingRemoveId}/delete?api_token=${api_token}`);
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
function pushNewOpinion(opinion) {
    opinions.value.push(opinion);
    activePageIndex.value = opinions.value.length - 1;
    setTimeout(function () {
        document.getElementById(`opinion-${activePageIndex.value}`).scrollIntoView();
    }, 300);
    sessionStorage.toastMsg = t("messages.successCreateOpinion")
    userStore.recentTriggerToast = Date.now()
}
function updateOpinion(opinion) {
    for (const key in opinions.value) {
        if (opinions.value[key].id == opinion.id) {
            opinions.value[key] = opinion;
        }
    }    
    sessionStorage.toastMsg = t("messages.successUpdateOpinion")
    userStore.recentTriggerToast = Date.now()
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
            <OpinionCKEditorComponent :iconicBtn="true" :name="'content'"
                :discussionId="discussion_id" @pushNewOpinion="pushNewOpinion" />
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
                                </div>
                                <div class="flex-grow-1">
                                    <div>
                                        <div>By {{ opinion.author_name }}</div>
                                        <div>Created {{ opinion.f1_created_at }}</div>
                                    </div>
                                    <div v-show="index == activePageIndex">
                                        <hr>
                                        <div class="ck-content" :id="`ck-show-opinion-${opinion.id}`"
                                            v-html="opinion.content"></div>
                                        <OpinionCKEditorComponent v-if="opinion.is_your_own == 'yes'" :iconicBtn="false"
                                            :name="`opinion-${opinion.id}`" :orgContent="opinion.content"
                                            :discussionId="discussion_id" :opinionId="opinion.id"
                                            @showOpinionContent="showOpinionContent(`ck-show-opinion-${opinion.id}`)"
                                            @updateOpinion="updateOpinion" />
                                        <hr>
                                    </div>
                                    <div class="mt-2 d-flex">
                                        <VotesComponent :sector="'opinion_votes'" :id="opinion.id"
                                            :votes="opinion.votes" :voted="opinion.voted == 'yes' ? true : false">
                                        </VotesComponent>
                                        <OtherActionsComponent :showId="`ck-show-opinion-${opinion.id}`"
                                            :editorId="`ckeditor-ctn-opinion-${opinion.id}`"
                                            :isYourOwn="opinion.is_your_own == 'yes' ? true : false" />
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
</template>