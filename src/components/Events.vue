<script setup>
import { ref, onMounted } from 'vue';
import axios from "axios";

const events = ref(null);
onMounted(() => {
	eventsLoad();
})

function eventsLoad() {
	axios.get('https://nvn1.000webhostapp.com/api/events')
		.then(function (response) {
			let data = response.data;
			events.value = data.events;
		});
}
</script>

<template>
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