<script setup>
import HeaderComponent from './components/Header.vue'
import LoginRequiredModalComponent from './components/partials/LoginRequiredModal.vue';
import ToastComponent from './components/partials/Toast.vue';
</script>

<template>
    <HeaderComponent />
    <div class="container pt-10">
        <router-view />
    </div>
    <LoginRequiredModalComponent />
    <ToastComponent />
</template>

<style scoped>
</style>