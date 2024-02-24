import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
    const isLoggedIn = ref(false);
    const username = ref(null);
    const isAdmin = ref(false);
    function $reset() {
        isLoggedIn.value = false
        username.value = null
        id.value = null
        isAdmin.value = false
    }
    return { $reset, isLoggedIn, username, isAdmin }
});