import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSearchStore = defineStore('search', () => {
    const data = ref(false);
    const quantity = ref(false);
    
    return { data, quantity }
});