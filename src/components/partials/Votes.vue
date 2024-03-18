<script setup>
import { ref, computed, reactive } from 'vue';
import { useUserStore } from '../../stores/UserStore';
// import LoginRequiredModalComponent from './LoginRequiredModal.vue';

// const loginRequiredModalRef = ref(null);
const userStore = useUserStore();
const props = defineProps(['voted', 'votes', 'id', 'sector']);
const emit = defineEmits(['vote'])
const isPause = ref(false);
const change = ref(0);
const currentVote = ref(null);
const ctnClassObj = reactive({
    'bg-gray': false,
});
const voted = computed(() => { return currentVote.value !== null ? currentVote.value : props.voted })
async function vote() {
    isPause.value = true;
    if (!userStore.isLoggedIn) {
        loginRquiredModal.show();
        isPause.value = false;
        return false;
    }
    let api_token = helpers.getCookie('api_token');
    let formdata = new FormData();
    if (api_token) formdata.append("api_token", api_token);
    if (props.id) formdata.append("id", props.id);
    let response = await fetch(`${API_BASE}/${props.sector}/toggle`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
        },
        body: formdata
    });
    switch (response.status) {
        case 200:
            change.value -= 1;
            currentVote.value = false;
            isPause.value = false;
            break;
        case 201:
            change.value += 1;
            currentVote.value = true;
            isPause.value = false;
            break;
        default:
            console.log("Something is wrong!");
    }
}
function blurLook() {
    ctnClassObj['bg-gray'] = true;
}
function clearLook() {
    ctnClassObj['bg-gray'] = false;
}
</script>

<template>
    <div style="width: 70px; height: 26px;"
        class="cursor-pointer border border-dark rounded ps-2 pe-2 d-flex justify-content-center align-items-center"
        :class="ctnClassObj" @click="vote" @mouseover="blurLook" @mouseout="clearLook">
        <span v-show="isPause" class="spinner-border spinner-border-sm position-absolute" role="status"
            aria-hidden="true"></span>
        <i class="bi me-2 bi-hand-thumbs-up-fill text-orange" v-show="!isPause && voted"></i>
        <i class="bi me-2 bi-hand-thumbs-up" v-show="!isPause && !voted"></i>
        <span v-show="!isPause">{{ votes + change }}</span>
    </div>
    <!-- <LoginRequiredModalComponent ref="loginRequiredModalRef" /> -->
</template>