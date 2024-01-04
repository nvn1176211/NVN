<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import axios from "axios";

const route = useRoute();
const event_id = route.params.id;
const event_name = ref(null);
const event_content = ref(null);
const event_thumbnail = ref(null);
const event_created_at = ref(null);
const event_created_by = ref(null);
const event_another_version = ref([]);
const avClass = ref(null);
onMounted(() => {
    axios.get(`https://nvn1.000webhostapp.com/api/events/${event_id}`)
        .then(function (response) {
            let event = response.data.event;
            event_name.value = event.name;
            event_content.value = event.content;
            event_thumbnail.value = event.thumbnail;
            event_created_at.value = event.created_at;
            event_created_by.value = event.created_by;
            event_another_version.value = response.data.another_version;
            avClass.value = event_another_version.value.length > 0 ? '' : 'd-none';
        });
})
async function download_thumbnail(event_thumbnail) {
    const response = await fetch(event_thumbnail);
    const blobImage = await response.blob();
    const href = URL.createObjectURL(blobImage);
    const anchorElement = document.createElement('a');
    anchorElement.href = href;
    anchorElement.download = 'thumbnal.png';
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
    URL.revokeObjectURL(href);
}

</script>

<template>
    <div class="mb-5">
        <div class="mb-4">
            <div id="title-block" class="d-flex justify-content-between align-items-center">
                <h2>{{ event_name }}</h2>
                <button class="btn btn-danger d-none" data-bs-toggle="modal" data-bs-target="#removeConfirmModal"
                    id="removeEventPageBtn"><i class="bi bi-trash"></i></button>
            </div>
            <hr class="mt-2 mb-0">
        </div>
        <div class="row">
            <div class="col-12 col-md-6">{{ event_content }}</div>
            <div class="col-12 col-md-6">
                <div class="position-relative p-2 border" id="thumbnail-block">
                    <img :src="event_thumbnail" alt="" width="100%" height="auto">
                    <a class="bg-white position-absolute end-0 bottom-0 p-2 download-btn" href="javascript:void(0)"
                        :data-href="event_thumbnail" @click="download_thumbnail(event_thumbnail)">
                        <i class="bi bi-download"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div :class="avClass">
        <h6>Edit History</h6>
        <hr class="mt-2 mb-2">
        <div>
            <ul id="event-edit-history-ul">
                <li>
                    <router-link :to="`/events/${event_id}`">Created at: {{ event_created_at }} - Created by: {{
                        event_created_by }}</router-link>
                </li>
                <li v-for="item in event_another_version">
                    <a href="javascript:void(0)">Created at: {{ item.created_at }} - Created by: {{ item.created_by }}</a>
                    <!-- <router-link :to="item.link">Created at: {{ item.created_at }} - Created by: {{ item.created_by }}</router-link> -->
                </li>
            </ul>
        </div>
    </div>
    <div class="modal fade" id="removeConfirmModal" tabindex="-1" aria-labelledby="removeConfirmModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <h5 class="modal-title text-center" id="removeConfirmModalLabel">Are you sure?</h5>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                    <button type="button" class="btn btn-primary" id="removeConfirmedBtn"
                        data-bs-dismiss="modal">Yes</button>
                </div>
            </div>
        </div>
    </div>
</template>