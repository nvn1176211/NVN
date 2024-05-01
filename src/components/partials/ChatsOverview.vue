<script setup>
const props = defineProps(['numberOfOpinions']);
</script>

<template>
    <div class="common-btn co-container border border-dark rounded ps-2 pe-2 d-flex justify-content-center align-items-center">
        <span class="me-1">{{ numberOfOpinions }}</span>
        <i class="ms-1 bi bi-chat"></i>
    </div>
</template>

<style scoped>
.co-container{
    width: 70px; height: 26px;
}
</style>