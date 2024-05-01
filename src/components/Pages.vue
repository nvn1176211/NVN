<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/UserStore';
import SubmitBtnComponent from './partials/SubmitBtn.vue';
import { useFetch } from '../composables/fetch'

const isDisabledBtn = ref(false);
const userStore = useUserStore();
const event_search = ref(null);
const router = useRouter();
let timeDiff = window.helpers.timeDiff;

const searchUrl = computed(() => {
	return `${env.API_BASE}/pages?search=${event_search.value ?? ''}`
});
const pages = computed(() => {
	return data.value ? (data.value.pages ?? []) : [];
});
const pagesCount = computed(() => {
	return data.value ? (data.value.pages ? data.value.pages.length : 0) : 0;
});
const { data } = useFetch(searchUrl);

function moveToCreatePage() {
	isDisabledBtn.value = true;
	router.push({ name: 'createPage' });
}
function openPage(url){
	router.push(url);
}
</script>

<template>
	<div class="row">
		<div class="col-12 col-md-6">
			<div class="position-relative h-100">
				<input id="t-search-i" class="form-control h-100" type="text"
					:placeholder="$t('messages.pageSearchPlaceholder')" code-val="" v-model="event_search">
				<div id="s-result-popup">

				</div>
			</div>
		</div>
		<div class="col-12 col-md-6">
			<div class="d-flex align-items-center justify-content-end">
				<div class="d-flex flex-column me-2">
					<span>{{ pagesCount }}</span>
					<span class="text-uppercase">{{ $t('labels.pages') }}</span>
				</div>
				<div id="createPageCtn" v-if="userStore.isLoggedIn">
					<SubmitBtnComponent @submit="moveToCreatePage" :isDisabled="isDisabledBtn" title="Create new page">
						<i class="bi bi-plus-lg" v-show="!isDisabledBtn"></i>
					</SubmitBtnComponent>
				</div>
			</div>
		</div>
	</div>
	<div class="mt-5">
		<div class="page d-flex border border-gray rounded mb-3" v-for="page in pages"
			@click="openPage(`/${page.type}/${page.id}`)">
			<div>
				<img v-if="page.thumbnail" :src="page.thumbnail" class="w-256px h-auto rounded-start" alt="thumbnail">
				<div v-if="!page.thumbnail"
					class="w-256px h-160px bg-whitesmoke rounded-start d-flex justify-content-center align-items-center">
					<i class="bi bi-file-text fs-1"></i>
				</div>
			</div>
			<div>
				<div class="card-body ps-3 pe-3 pt-3 pb-3">
					<div>
						<span class="fw-bold">{{ page.author_name }}</span>
						<i class="bi bi-dot"></i>
						<span class="text-small text-secondary">
							<small :title="page.f1_created_at">{{ timeDiff(page.f1_created_at) }}</small>
						</span>
					</div>
					<h5 class="card-title">{{ page.name }}</h5>
				</div>
			</div>
		</div>
	</div>
</template>
<style scoped>
.page {
	cursor: pointer;
}

.page:hover {
	background-color: var(--bs-tertiary-bg);
}
</style>