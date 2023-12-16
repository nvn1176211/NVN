<script setup>
</script>

<template>
    <div class="row">
        <div class="col-12 col-md-6">
            <div class="position-relative h-100">
                <input id="t-search-i" class="form-control h-100" type="text" placeholder="Enter event name..." code-val="">
                <div id="s-result-popup">

                </div>
            </div>
        </div>
        <div class="col-12 col-md-6">
            <div class="d-flex align-items-center justify-content-end">
                <div class="d-flex flex-column me-2">
                    <span id="numberOfPage">0</span>
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