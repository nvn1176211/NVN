<script setup>
import { ref, reactive } from 'vue';
import PageCKEditorComponent from './partials/PageCKEditor.vue';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps(['orgContent', 'stageId', 'articleId']);
const emit = defineEmits(['updateArticle'])
const inputs = reactive({
  content: {
    errMsg: null,
    isInvalid: false,
    val: '',
  },
});
let ckFields = {
  content: 'article-editor'
};
const isSaving = ref(false);
const articleEditorRef = ref(null);
const editorRef = ref(null);

/**
 * @param String newContent
 * @return Void
 */
function cancelCompose(newContent) {
  articleEditorRef.value.classList.add('d-none');
  if(props.stageId){
    document.getElementById(props.stageId).classList.remove('d-none');
  }
  helpers.refreshFormErrInput(inputs, ckFields);
  editorRef.value.cancelCompose(newContent);
}

async function save() {
  helpers.refreshFormErrInput(inputs, ckFields);
  isSaving.value = true;
  let url = `${env.ARTICLES_UPDATE_API}/${props.articleId}`;
  let formdata = new FormData();
  let api_token = helpers.getCookie('api_token');
  let content = editorRef.value.content;
  formdata.append("article_id", props.articleId);
  if (api_token) formdata.append("api_token", api_token);
  if (content) formdata.append("content", content);
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
      helpers.handleInvalidInput(resBodyObj, inputs, null, ckFields);
      isSaving.value = false;
      break;
    case 200:
      cancelCompose(resBodyObj.content);
      isSaving.value = false;
      emit('updateArticle', resBodyObj.content);
      break;
    default:
      console.error(t("messages.somethingWrong"));
      isSaving.value = false;
  }
}
</script>

<template>
  <div id="article-editor" class="border rounded d-none" ref="articleEditorRef">
    <PageCKEditorComponent :name="'content'" ref="editorRef" :orgContent="orgContent"
      :isInvalid="inputs.content.isInvalid" :errMsg="inputs.content.errMsg" />
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