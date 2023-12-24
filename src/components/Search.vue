<script setup>
    import { ref, watch } from 'vue';
    const event_search = ref(null);
    const event_search2 = ref(null);
    watch(() => event_search.value + event_search2.value, (new_event_search) => {
        console.log(new_event_search);
    })
</script>

<template>
    <div class="row">
        <div class="col-12 col-md-6">
            <div class="position-relative h-100">
                <input id="t-search-i" class="form-control h-100" type="text" placeholder="Enter event name..." code-val="" v-model="event_search">
                <div id="s-result-popup">

                </div>
            </div>
        </div>
        <div class="col-12 col-md-6">
            <div class="d-flex align-items-center justify-content-end">
                <div class="d-flex flex-column me-2">
                    <span id="numberOfPage"></span>
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
</template>