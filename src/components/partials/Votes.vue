<script setup>
import { ref, computed, reactive } from 'vue';
import { useUserStore } from '../../stores/UserStore';

const userStore = useUserStore();
const props = defineProps(['voted', 'votes', 'event_id']);
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
        let myModal = new bootstrap.Modal(document.getElementById('loginRquiredModal'), {
            keyboard: false
        });
        myModal.toggle();
        isPause.value = false;
        return false;
    }
    let api_token = getCookie('api_token');
    let formdata = new FormData();
    if (api_token) formdata.append("api_token", api_token);
    if (props.event_id) formdata.append("event_id", props.event_id);
    let response = await fetch(`${API_BASE}/votes/toggle`, {
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
            console.log("Error");
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
    <div class="modal fade" id="loginRquiredModal" tabindex="-1" aria-labelledby="loginRquiredModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <h5 class="modal-title text-center" id="loginRquiredModalLabel">{{ $t("messages.loginRequired") }}</h5>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary text-capitalize" data-bs-dismiss="modal">{{
                        $t("labels.close") }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>