<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '../../stores/UserStore';

const userStore = useUserStore();
const props = defineProps(['voted', 'votes', 'id', 'sector', 'isEditable']);
const emit = defineEmits(['vote'])
const isPause = ref(false);
const change = ref(0);
const currentVote = ref(null);
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
    let response = await fetch(`${env.API_BASE}/${props.sector}/toggle`, {
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
            console.error("Something is wrong!");
    }
}
</script>

<template>
    <div v-show="!isEditable">
        <i class="bi me-2 bi-hand-thumbs-up-fill text-orange" v-show="voted"></i>
        <i class="bi me-2 bi-hand-thumbs-up" v-show="!voted"></i>
        <span>{{ votes + change }}</span>
    </div>
    <div class="common-btn vote-ctn cursor-pointer border border-dark rounded ps-2 pe-2 me-2 justify-content-center align-items-center" :class="isEditable ? 'd-flex' : 'd-none'"
        @click="vote">
        <span v-show="isPause" class="spinner-border spinner-border-sm position-absolute" role="status"
            aria-hidden="true"></span>
        <i class="bi me-2 bi-hand-thumbs-up-fill text-orange" v-show="!isPause && voted"></i>
        <i class="bi me-2 bi-hand-thumbs-up" v-show="!isPause && !voted"></i>
        <span v-show="!isPause">{{ votes + change }}</span>
    </div>
</template>
<style scoped>
.vote-ctn {
    width: 70px;
    height: 26px;
}
</style>