<script setup>
import { ref, onMounted } from 'vue';

defineProps(['name', 'isInvalid', 'errMsg']);
let editorInstance;
const content = ref(null);
defineExpose({
  content, setData
})

onMounted(() => {
  ClassicEditor
    .create(document.querySelector('#pageEditor'), {
      extraPlugins: [CKCustomUploadAdapterPlugin],
      image: {
        upload: {
          types: [ 'jpeg', 'png' ]
        }
      },
      mediaEmbed: {
        previewsInData: true
      }
    })
    .then(editor => {
      window.myEditor = editor;
      editor.model.document.on('change:data', () => {
        editorInstance = editor;
        content.value = editor.getData();
      });
    })
    .catch(error => {
      console.error(error);
    });
})

function CKCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new CKCustomUploadAdapter(loader);
  };
}

function setData(data) {
  editorInstance.setData(data);
}
</script>
<template>
  <div class="pageEditorCtn" :id="`ckeditor-ctn-${name}`">
    <div id="pageEditor" :class="{ 'is-invalid': isInvalid }"></div>
    <div class="invalid-feedback ps-2">{{ errMsg }}</div>
  </div>
</template>
<style>
.pageEditorCtn .ck-editor__editable_inline:not(.ck-comment__input *) {
  height: 300px;
  overflow-y: auto;
}
</style>