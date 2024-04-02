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
    .create(document.querySelector('#opinionEditor'), {
      toolbar: ['heading', '|', 'bold', 'italic', '|', 'link', 'blockQuote', '|', 'numberedList', 'bulletedList', 'outdent', 'indent']
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

function setData(data){
  editorInstance.setData(data);
}
</script>
<template>
  <div :id="`ckeditor-ctn-${name}`">
    <div id="opinionEditor"></div>
    <textarea :class="{ 'is-invalid': isInvalid }" style="display: none;"></textarea>
    <div class="invalid-feedback ps-2">{{ errMsg }}</div>
  </div>
</template>