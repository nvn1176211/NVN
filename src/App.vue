<script setup>
import HeaderComponent from './components/Header.vue'
import LoginRequiredModalComponent from './components/partials/LoginRequiredModal.vue';
import ToastComponent from './components/partials/Toast.vue';

</script>

<template>
    <HeaderComponent />
    <router-view />
    <LoginRequiredModalComponent />
    <ToastComponent />
</template>

<style scoped>
</style>