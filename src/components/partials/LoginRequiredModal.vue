<script setup>
import { onMounted } from 'vue';
onMounted(() => {
    window.loginRquiredModal = new bootstrap.Modal(document.getElementById('loginRquiredModal'), {
        keyboard: false
    });
})
function hide() {
    loginRquiredModal.hide();
}
</script>

<template>
    <div class="modal fade" id="loginRquiredModal" tabindex="-1" aria-labelledby="loginRquiredModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <h5 class="modal-title text-center" id="loginRquiredModalLabel">{{ $t("messages.loginRequired") }}
                    </h5>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary text-capitalize" @click="hide">{{
                        $t("labels.close") }}</button>
                </div>
            </div>
        </div>
    </div>
</template>