<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps(['name', 'orgContent', 'isInvalid', 'errMsg']);
let editorInstance;
const content = ref(props.orgContent);
defineExpose({
  content, cancelCompose
})

onMounted(() => {
  ClassicEditor
    .create(document.querySelector(`#simple-editor-${props.name}`), {
      toolbar: ['heading', '|', 'bold', 'italic', '|', 'link', 'blockQuote', '|', 'numberedList', 'bulletedList', 'outdent', 'indent']
    })
    .then(editor => {
      editor.setData(props.orgContent ?? '');
      editorInstance = editor;
      editor.model.document.on('change:data', () => {
        content.value = editor.getData();
      });
    });
})

/**
 * @param String newContent
 * @return Void
 */
 function cancelCompose(newContent) {
   editorInstance.setData(newContent ?? (props.orgContent ?? ''));
}
</script>
<template>
  <div :id="`ckeditor-ctn-${name}`">
    <div :id="`simple-editor-${name}`" :class="{ 'is-invalid': isInvalid }"></div>
    <div class="invalid-feedback ps-2">{{ errMsg }}</div>
  </div>
</template>