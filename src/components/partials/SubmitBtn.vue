<script setup>
defineProps(['isDisabled']);
const emit = defineEmits(['submit'])
function submit() {
    emit('submit');
}
</script>

<template>
    <button class="btn btn-primary" type="button" @click="submit" :disabled="isDisabled">
        <span v-show="isDisabled" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <slot />
    </button>
</template>