<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useUserStore } from '../../stores/UserStore';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStore();
const props = defineProps(['iconicBtn', 'name', 'orgContent', 'discussionId', 'opinionId']);
let editorInstance;
const inputs = reactive({
  content: {
    errMsg: null,
    isInvalid: false,
    val: '',
  },
});
let ckFields = {
  content: `ckeditor-ctn-${props.name}`
};
const isSaveOpinionLoading = ref(false);
const ckeditorCtnRef = ref(null);
const iconicBtnRef = ref(null);
defineExpose({
  openOpinionCompose
})
const emit = defineEmits(['showOpinionContent', 'pushNewOpinion', 'updateOpinion'])

onMounted(() => {
  ClassicEditor
    .create(document.querySelector(`#ckeditor-${props.name}`), {
      toolbar: ['heading', '|', 'bold', 'italic', '|', 'link', 'blockQuote', '|', 'numberedList', 'bulletedList', 'outdent', 'indent']
    })
    .then(editor => {
      editor.setData(props.orgContent ?? '');
      editorInstance = editor;
      editor.model.document.on('change:data', () => {
        inputs.content.val = editor.getData();
      });
    });
})

/**
 * @param String newContent
 * @return Void
 */
function cancelOpinionCompose(newContent) {
  helpers.refreshFormErrInput(inputs, ckFields);
  ckeditorCtnRef.value.classList.add('d-none');
  emit('showOpinionContent');
  editorInstance.setData(newContent ? newContent : (props.orgContent ?? ''));
  if (props.iconicBtn) {
    iconicBtnRef.value.classList.remove('d-none');
  }
}

function openOpinionCompose() {
  if (!userStore.isLoggedIn) {
    loginRquiredModal.show();
    return false;
  }
  ckeditorCtnRef.value.classList.remove('d-none');
  if (props.iconicBtn) {
    iconicBtnRef.value.classList.add('d-none');
  }
}

async function saveOpinion() {
  helpers.refreshFormErrInput(inputs, ckFields);
  isSaveOpinionLoading.value = true;
  let url = props.opinionId ? `${env.OPINIONS_UPDATE_API}/${props.opinionId}` : env.OPINIONS_CREATION_API;
  let formdata = new FormData();
  let api_token = helpers.getCookie('api_token');
  formdata.append("discussion_id", props.discussionId);
  if (api_token) formdata.append("api_token", api_token);
  if (inputs.content.val) formdata.append("content", inputs.content.val);
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
      isSaveOpinionLoading.value = false;
      break;
    case 201:
      cancelOpinionCompose(null);
      isSaveOpinionLoading.value = false;
      emit('pushNewOpinion', resBodyObj);
      break;
    case 200:
      cancelOpinionCompose(resBodyObj.content);
      isSaveOpinionLoading.value = false;
      emit('updateOpinion', resBodyObj);
      break;
    default:
      console.log(t("messages.somethingWrong"));
      isSaveOpinionLoading.value = false;
  }
}
</script>
<template>
  <button class="btn btn-primary" @click="openOpinionCompose" v-if="iconicBtn" ref="iconicBtnRef">{{
    $t("messages.addAOpinion") }}</button>
  <div class="border rounded d-none" ref="ckeditorCtnRef">
    <div :id="`ckeditor-ctn-${name}`">
      <div :id="`ckeditor-${name}`"></div>
      <textarea :class="{ 'is-invalid': inputs.content.isInvalid }" style="display: none;"></textarea>
      <div class="invalid-feedback ps-2">{{ inputs.content.errMsg }}</div>
    </div>
    <div class="p-2 d-flex justify-content-end">
      <button class="btn btn-secondary me-2" @click="cancelOpinionCompose(null)">{{ $t("labels.cancel")
        }}</button>
      <button class="btn btn-primary" @click="saveOpinion" :disabled="isSaveOpinionLoading">
        <span v-show="isSaveOpinionLoading" class="spinner-border spinner-border-sm" role="status"
          aria-hidden="true"></span>
        {{ $t("labels.save") }}
      </button>
    </div>
  </div>
</template>