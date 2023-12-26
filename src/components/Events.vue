<script setup>
import { ref, watch } from 'vue';
import axios from "axios";

const events = ref(null);
const event_search = ref(null);
const event_pages = ref(0);
let is_search_requesting = false;

watch(event_search, (new_event_search) => {
	if(is_search_requesting) return false;
	is_search_requesting = true;

	axios.get('https://nvn1.000webhostapp.com/api/events', {
			params: {
				search: new_event_search
			}
		})
		.then(function (response) {
			let data = response.data;
			events.value = data.events;
			event_pages.value = data.events.length;
			is_search_requesting = false;
		});
	}, 
	{ immediate: true }
)
</script>

<template>
	<div class="row">
		<div class="col-12 col-md-6">
			<div class="position-relative h-100">
				<input id="t-search-i" class="form-control h-100" type="text" placeholder="Enter event name..." code-val=""
					v-model="event_search">
				<div id="s-result-popup">

				</div>
			</div>
		</div>
		<div class="col-12 col-md-6">
			<div class="d-flex align-items-center justify-content-end">
				<div class="d-flex flex-column me-2">
					<span>{{ event_pages }}</span>
					<span>PAGES</span>
				</div>
				<div class="d-none" id="createPageCtn">
					<a href="#" class="btn btn-primary" title="Create new page" id="createPageBtn">
						<i class="bi bi-plus-lg"></i>
					</a>
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
					<a href="javascript:void(0)">See more</a>
				</div>
			</div>
		</div>
	</div>
	<div id="events-ctn" class="row mt-5"></div>
</template>