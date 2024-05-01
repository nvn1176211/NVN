<script setup>

const props = defineProps(['isYourOwn', 'editorId', 'stageId']);
const emit = defineEmits(['showEditor', 'hideStage'])
function edit(){
    document.getElementById(props.stageId).classList.add('d-none');
    document.getElementById(props.editorId).classList.remove('d-none');
}
</script>

<template>
    <div class="dropdown other-actions-btn border border-dark rounded ps-2 pe-2 me-2" role="button" id="dropdownMenuButton1"
            data-bs-toggle="dropdown" aria-expanded="false">
        <i class="bi bi-three-dots"></i>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li class="dropdown-item" v-if="isYourOwn" @click="edit">
                <i class="bi bi-pencil me-3"></i>
                <span>Edit</span>
            </li>
            <!-- <li class="dropdown-item" v-if="isYourOwn">
                <i class="bi bi-trash me-3"></i>
                <span>Delete</span>
            </li> -->
        </ul>
    </div>
</template>
<style scoped>
.other-actions-btn:hover {
    background-color: var(--bs-tertiary-bg);
}
</style>