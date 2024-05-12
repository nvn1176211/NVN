import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
    const isLoggedIn = ref(false);
    const username = ref(null);
    const email = ref(null);
    const isAdmin = ref(false);
    const recentTriggerToast = ref(Date.now());
    function $reset() {
        isLoggedIn.value = false
        username.value = null
        email.value = null
        isAdmin.value = false
    }
    return { $reset, isLoggedIn, username, email, isAdmin, recentTriggerToast }
});