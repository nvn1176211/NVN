<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ArticleEditorComponent from './ArticleEditor.vue';
import OtherActionsComponent from './partials/OtherActions.vue';
import SubmitBtnComponent from './partials/SubmitBtn.vue';
import { useI18n } from "vue-i18n";
import VotesComponent from './partials/Votes.vue';
import { useUserStore } from '../stores/UserStore';

const userStore = useUserStore();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const articleId = route.params.id;
const articleName = ref(null);
const articleAuthorName = ref(null);
const articleCreatedAt = ref(null);
const articleVotes = ref(0);
const articleVoted = ref('no');
const isDisabledBtn = ref(false);
const isLoadingSpinActive = ref(true);
const articleContentRef = ref(null);
const articleContent = ref('');
const isYourOwnArticle = ref(false);
let removeConfirmModal = null;
let pendingRemovetId = null;
onMounted(async () => {
    removeConfirmModal = new bootstrap.Modal(document.getElementById('removeConfirmModal'), {
        keyboard: false
    })
    let api_token = helpers.getCookie('api_token') ?? '';
    await fetch(`${env.API_BASE}/articles/${articleId}?api_token=${api_token}`)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            articleContentRef.value.innerHTML = json.content;
            articleContent.value = json.content;
            articleName.value = json.name;
            articleVotes.value = json.votes;
            articleVoted.value = json.voted;
            isYourOwnArticle.value = json.is_your_own == 'yes' ? true : false;
            articleAuthorName.value = json.author_name;
            articleCreatedAt.value = json.f1_created_at;
            isLoadingSpinActive.value = false;
        });
})
async function removePage() {
    // isDisabledBtn.value = true;
    // let api_token = helpers.getCookie('api_token');
    // const response = await fetch(`${env.API_BASE}/events/${pendingRemovetId}/delete?api_token=${api_token}`);
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
    pendingRemovetId = id;
    removeConfirmModal.show();
}
function updateArticle(content){
    articleContentRef.value.innerHTML = content;
    sessionStorage.toastMsg = t("messages.successUpdateArticle")
    userStore.recentTriggerToast = Date.now()
}
</script>

<template>
    <div class="d-flex justify-content-center" v-if="isLoadingSpinActive">
        <span class="spinner-border spinner-border-sm tag-search-spin" role="status" aria-hidden="true"></span>
    </div>
    <div v-show="!isLoadingSpinActive">
        <div>
            <div>
                <div id="title-block" class="d-flex justify-content-between align-items-center">
                    <h2>{{ articleName }}</h2>
                    <!-- <button v-if="userStore.isAdmin" @click="confirmRemove(articleId)" class="btn btn-danger mt-3"><i
                            class="bi bi-trash"></i></button> -->
                </div>
                <div class="mb-2">
                    <div>By {{ articleAuthorName }}</div>
                    <div>Created {{ articleCreatedAt }}</div>
                </div>
                <div class="mb-4 d-flex">
                    <VotesComponent class="me-2" :sector="'articles'" :id="articleId" :votes="articleVotes" :isEditable="true"
                        :voted="articleVoted == 'yes' ? true : false"></VotesComponent>
                    <OtherActionsComponent :stageId="'article-stage'" :editorId="'article-editor'"
                        :isYourOwn="isYourOwnArticle" v-if="isYourOwnArticle" />
                </div>
            </div>
        </div>
        <div id="article-stage" class="ck-content" ref="articleContentRef"></div>
        <ArticleEditorComponent v-if="isYourOwnArticle" :orgContent="articleContent"
            :stageId="'article-stage'" :articleId="articleId" @updateArticle="updateArticle" />
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