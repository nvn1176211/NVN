<script setup>
import HeaderComponent from './components/Header.vue'
import LoginRequiredModalComponent from './components/partials/LoginRequiredModal.vue';
</script>

<template>
    <HeaderComponent />
    <router-view />
    <LoginRequiredModalComponent />
</template>

<style scoped>
</style>