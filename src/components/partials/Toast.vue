<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from '../../stores/UserStore';

const userStore = useUserStore();
let sucessLoginToast;
const toastMessages = ref(null);

watch(() => userStore.recentTriggerToast, (new_val) => {
    sucessLoginToast = new bootstrap.Toast(document.getElementById('sucessLoginToast'));
    if (sessionStorage.toastMsg){
        toastMessages.value = sessionStorage.toastMsg;
		sucessLoginToast.show();
		sessionStorage.removeItem("toastMsg")
	}
});
</script>

<template>
	<div class="position-fixed top-0 start-50 translate-middle-x p-3" style="z-index: 11">
		<div id="sucessLoginToast" class="toast hide bg-success text-white" role="alert" aria-live="assertive"
			aria-atomic="true" data-bs-animation="true">
			<div class="toast-body d-flex justify-content-between align-items-center">
				<span>{{ toastMessages }}</span>
				<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
			</div>
		</div>
	</div>
</template>