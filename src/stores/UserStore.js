import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
    const username = ref(null);
    const isAdmin = ref(false);
    const isLoggedIn = ref(false);
    const display_name = ref(null);
    const gender_id = ref(null);
    const location_id = ref(null);
    const description = ref(null);
    const avatar = ref(env.DEFAULT_USER_AVATAR_URL);
    const email = ref(null);
    const recentTriggerToast = ref(Date.now());
    function $reset() {
        isLoggedIn.value = false
        username.value = null
        email.value = null
        isAdmin.value = false
    }
    return { $reset, isLoggedIn, username, display_name, gender_id, location_id, description, avatar, email, isAdmin, recentTriggerToast }
});