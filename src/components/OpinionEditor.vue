<script setup>
import { ref, reactive } from 'vue';
import SimpleCKEditorComponent from './partials/SimpleCKEditor.vue';
import { useI18n } from "vue-i18n";
import { useUserStore } from '../stores/UserStore';

const userStore = useUserStore();
const { t } = useI18n();
const props = defineProps(['iconicBtn', 'orgContent', 'name', 'stageId', 'opinionId', 'discussionId']);
const emit = defineEmits(['updateOpinion', 'pushNewOpinion'])
const inputs = reactive({
  content: {
    errMsg: null,
    isInvalid: false,
    val: '',
  },
});
let editorId = 'opinion-editor' + (props.opinionId ? ('-' + props.opinionId) : '');
let ckFields = {
  content: editorId
};
const isSaving = ref(false);
const opinionEditorRef = ref(null);
const iconicBtnRef = ref(null);
const editorRef = ref(null);

/**
 * @param String newContent
 * @return Void
 */
function cancelCompose(newContent) {
  opinionEditorRef.value.classList.add('d-none');
  if(iconicBtnRef.value) iconicBtnRef.value.classList.remove('d-none');
  if (props.stageId) {
    document.getElementById(props.stageId).classList.remove('d-none');
  }
  helpers.refreshFormErrInput(inputs, ckFields);
  editorRef.value.cancelCompose(newContent);
}

function openCompose() {
  if (!userStore.isLoggedIn) {
    loginRquiredModal.show();
    return false;
  }
  opinionEditorRef.value.classList.remove('d-none');
  if (props.iconicBtn) {
    iconicBtnRef.value.classList.add('d-none');
  }
}

async function save() {
  helpers.refreshFormErrInput(inputs, ckFields);
  isSaving.value = true;
  let url = props.opinionId ? `${env.OPINIONS_UPDATE_API}/${props.opinionId}` : env.OPINIONS_CREATION_API;
  let formdata = new FormData();
  let api_token = helpers.getCookie('api_token');
  let content = editorRef.value.content;
  if (api_token) formdata.append("api_token", api_token);
  if (content) formdata.append("content", content);
  if (props.discussionId) formdata.append("discussion_id", props.discussionId);
  if (props.opinionId) formdata.append("opinion_id", props.opinionId);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
    },
    body: formdata
  });
  const resBodyObj = await response.json();
  switch (response.status) {
    case 422:
      helpers.handleInvalidInput(resBodyObj, inputs, ['discussion_id'], ckFields);
      isSaving.value = false;
      break;
    case 201:
      cancelCompose(null);
      isSaving.value = false;
      emit('pushNewOpinion', resBodyObj);
      break;
    case 200:
      cancelCompose(resBodyObj.content);
      isSaving.value = false;
      emit('updateOpinion', resBodyObj);
      break;
    default:
      console.error(t("messages.somethingWrong"));
      isSaving.value = false;
  }
}
</script>

<template>
  <button class="btn btn-primary" @click="openCompose" v-if="iconicBtn" ref="iconicBtnRef">{{
    $t("messages.addAOpinion") }}</button>
  <div :id="editorId" class="border rounded d-none" ref="opinionEditorRef">
    <SimpleCKEditorComponent :name="name" ref="editorRef" :orgContent="orgContent" :isInvalid="inputs.content.isInvalid"
      :errMsg="inputs.content.errMsg" />
    <div class="p-2 d-flex justify-content-end">
      <button class="btn btn-secondary me-2" @click="cancelCompose(null)">{{ $t("labels.cancel")
        }}</button>
      <button class="btn btn-primary" @click="save" :disabled="isSaving">
        <span v-show="isSaving" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        {{ $t("labels.save") }}
      </button>
    </div>
  </div>
</template>