<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/UserStore';
import SubmitBtnComponent from './partials/SubmitBtn.vue';

const isSearchSpinActive = ref(true);
const isDisabledBtn = ref(false);
const userStore = useUserStore();
const pages = ref([]);
const event_search = ref(null);
const pagesCount = ref(0);
let is_search_requesting = false;
const router = useRouter();

watch(event_search, async (new_event_search) => {
	if (is_search_requesting) return false;
	search(new_event_search);
},
	{ immediate: true }
);

async function search(new_event_search) {
	is_search_requesting = true;
	isSearchSpinActive.value = true;
	await fetch(`${API_BASE}/pages?search=${new_event_search === null ? '' : new_event_search}`)
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			pages.value = json.pages;
			pagesCount.value = json.pages.length;
			is_search_requesting = false;
			isSearchSpinActive.value = false;
		});
	if (event_search.value != new_event_search) search(event_search.value);
}

function moveToCreatePage() {
	isDisabledBtn.value = true;
	// router.push('/create_event');
	router.push({ name: 'createPage' });
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
		<div class="d-flex justify-content-center" v-if="isSearchSpinActive">
			<span class="spinner-border spinner-border-sm tag-search-spin" role="status" aria-hidden="true"></span>
		</div>
		<div class="row" v-show="!isSearchSpinActive">
			<div class="col-12 col-md-6 mb-3" v-for="page in pages">
				<div class="event card">
					<img class="card-img-top" :src="page.thumbnail">
					<div class="card-body">
						<div class="d-flex justify-content-between">
							<div>
								<h4 class="card-title">{{ page.name }}</h4>
								<router-link :to="`/${page.type}/${page.id}`" class="text-capitalize">{{ $t('labels.seeMore')
									}}</router-link>
							</div>
							<div class="ms-3">
								<span class="badge bg-info text-capitalize">{{ page.type }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>