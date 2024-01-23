<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from '../stores/UserStore';

const userStore = useUserStore();
const events = ref(null);
const event_search = ref(null);
const event_pages = ref(0);
let is_search_requesting = false;

watch(event_search, async (new_event_search) => {
	if (is_search_requesting) return false;
	is_search_requesting = true;

	await fetch(`https://nvn1.000webhostapp.com/api/events?search=${new_event_search === null ? '' : new_event_search}`)
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			events.value = json.events;
			event_pages.value = json.events.length;
			is_search_requesting = false;
		});
},
	{ immediate: true }
);
</script>

<template>
	<div class="row">
		<div class="col-12 col-md-6">
			<div class="position-relative h-100">
				<input id="t-search-i" class="form-control h-100" type="text" :placeholder="$t('messages.eventSearchPlaceholder')" code-val=""
					v-model="event_search">
				<div id="s-result-popup">

				</div>
			</div>
		</div>
		<div class="col-12 col-md-6">
			<div class="d-flex align-items-center justify-content-end">
				<div class="d-flex flex-column me-2">
					<span>{{ event_pages }}</span>
					<span class="text-uppercase">{{ $t('labels.pages') }}</span>
				</div>
				<div id="createPageCtn" v-if="userStore.isLoggedIn">
					<router-link to="create_event" class="btn btn-primary" title="Create new page">
						<i class="bi bi-plus-lg"></i>
					</router-link>
				</div>
			</div>
		</div>
	</div>
	<div class="row mt-5">
		<div class="col-12 col-md-6 mb-3" v-for="event in events">
			<div class="event card">
				<img class="card-img-top" :src="event.thumbnail">
				<div class="card-body">
					<h4 class="card-title">{{ event.year }}: {{ event.name }}</h4>
					<router-link :to="`/events/${event.id}`" class="text-capitalize">{{ $t('labels.seeMore') }}</router-link>
				</div>
			</div>
		</div>
	</div>
	<div id="events-ctn" class="row mt-5"></div>
</template>