<script setup>
const props = defineProps(['target', 'activeTargetIndex']);
const emit = defineEmits(['toggle'])
function toggle() {
    emit('toggle');
}
</script>

<template>
    <button class="round-btn white-btn" @click="toggle">
        <i class="bi bi-plus-lg" v-show="target != activeTargetIndex"></i>
        <i class="bi bi-dash-lg" v-show="target == activeTargetIndex"></i>
    </button>
</template>