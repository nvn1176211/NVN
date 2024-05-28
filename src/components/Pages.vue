<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/UserStore';
import VotesComponent from './partials/Votes.vue';
import SubmitBtnComponent from './partials/SubmitBtn.vue';
import ImagesGalleryComponent from './partials/ImagesGallery.vue';
import { useFetch } from '../composables/fetch'
import { useSearchStore } from '../stores/SearchStore';

const searchStore = useSearchStore();
const isDisabledBtn = ref(false);
const userStore = useUserStore();
const router = useRouter();
let timeDiff = window.helpers.timeDiff;

// const event_search = ref(null);
// let api_token = helpers.getCookie('api_token');
// const searchUrl = computed(() => {
// 	return `${env.API_BASE}/pages?search=${event_search.value ?? ''}&api_token=${api_token ?? ''}`
// });
// const pages = computed(() => {
// 	return data.value ? (data.value.pages ?? []) : [];
// });
// const pagesCount = computed(() => {
// 	return data.value ? (data.value.pages ? data.value.pages.length : 0) : 0;
// });
// const { data } = useFetch(searchUrl);

function moveToCreatePage() {
	isDisabledBtn.value = true;
	router.push({ name: 'createPage' });
}
function openPage(url) {
	router.push(url);
}
</script>

<template>
	<div class="row">
		<div class="col-12 col-md-6">
			<!-- <div class="position-relative h-100">
				<input id="t-search-i" class="form-control h-100" type="text"
					:placeholder="$t('messages.pageSearchPlaceholder')" code-val="" v-model="event_search">
				<div id="s-result-popup">

				</div>
			</div> -->
		</div>
		<div class="col-12 col-md-6">
			<div class="d-flex align-items-center justify-content-end">
				<!-- <div class="d-flex flex-column me-2">
					<span>{{ pagesCount }}</span>
					<span class="text-uppercase">{{ $t('labels.pages') }}</span>
				</div> -->
				<div id="createPageCtn" v-if="userStore.isLoggedIn">
					<SubmitBtnComponent @submit="moveToCreatePage" :isDisabled="isDisabledBtn">
						<i class="bi bi-plus-lg me-1" v-show="!isDisabledBtn"></i>
						<span>{{ $t('messages.createANewPost') }}</span>
					</SubmitBtnComponent>
				</div>
			</div>
		</div>
	</div>
	<div class="mt-5">
		<div class="page d-flex border rounded mb-3" v-for="page in searchStore.data">
			<div class="page-left-part">
				<ImagesGalleryComponent v-if="page.thumbnail" :imgUrl="page.thumbnail" :galleryId="page.id" />
				<div v-if="!page.thumbnail"
					class="w-100percent h-100percent bg-whitesmoke rounded-start d-flex justify-content-center align-items-center">
					<i class="bi bi-file-text fs-1"></i>
				</div>
			</div>
			<div @click="openPage(`/${page.type}/${page.id}`)" class="page-right-part">
				<div class="ps-3 pe-3 pt-3 pb-3">
					<div>
						<span class="fw-bold">{{ page.author_name }}</span>
						<i class="bi bi-dot"></i>
						<span class="text-small text-secondary">
							<small :title="page.f1_created_at">{{ timeDiff(page.f1_created_at) }}</small>
						</span>
					</div>
					<div class="d-flex align-items-center mt-1 mb-2">
						<span class="badge bg-primary text-capitalize me-2">{{ page.type }}</span>
						<h5 class="page-title m-0">{{ page.name }}</h5>
					</div>
					<div class="d-flex">
						<VotesComponent :sector="page.type" :id="page.id" :votes="page.votes" :isEditable="true"
							:voted="page.voted == 'yes' ? true : false" class="z-index-99" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<style scoped>
.page {
	border-color: rgb(204, 206, 209);
	flex-wrap: wrap;
}

.page-title {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	margin-bottom: 10px;
}

.page-left-part {
	height: 160px;
	flex: 0 0 256px;
	flex-grow: 1;
}

.page-right-part {
	cursor: pointer;
	overflow: hidden;
	flex-grow: 99;
}

.page-right-part:hover {
	background-color: var(--bs-tertiary-bg);
}

@media only screen and (min-width: 768px) {
	.page {
		flex-wrap: nowrap;
	}

	.page-left-part {
		flex-grow: 0;
	}
}
</style>