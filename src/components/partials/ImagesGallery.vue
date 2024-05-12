<script setup>
import { ref, onMounted } from 'vue';
const props = defineProps(['imgUrl', 'galleryId'])

const zoomInIconRef = ref(null)
const galleryHeaderRef = ref(null)
const isShowToolPanel = ref(false)
let galleryModal = null;
let hiddenPanelActionTimer;
onMounted(() => {
    galleryModal = new bootstrap.Modal(document.getElementById(`img-gallery-modal-${props.galleryId}`), {
        keyboard: false
    })
})
function zoomIn(){
    galleryModal.show()
}
function showZoomInIcon(){
    zoomInIconRef.value.style.visibility = 'visible'
}
function hiddenZoomInIcon(){
    zoomInIconRef.value.style.visibility = 'hidden'
}
function activeGalleryToolPanel(){
    isShowToolPanel.value = true;
    clearTimeout(hiddenPanelActionTimer);
    hiddenPanelActionTimer = setTimeout(function(){
        isShowToolPanel.value = false;
    }, 1500)
}
function download(imgUrl){
    helpers.download_img(imgUrl);
}
</script>

<template>
    <div class="imagesGallery d-flex justify-content-center rounded" @click="zoomIn" @mouseover="showZoomInIcon" @mouseout="hiddenZoomInIcon" 
        :style="{ backgroundImage: `url(${imgUrl})` }">
            <div class="blur-sheet rounded"></div>
            <i class="bi bi-box-arrow-up-right zoom-in-icon" ref="zoomInIconRef"></i>
    </div>
    <div class="modal fade" :id="`img-gallery-modal-${galleryId}`" tabindex="-1" aria-labelledby="testModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered gallery-modal">
            <div class="modal-content custom-modal-content" @mousemove="activeGalleryToolPanel">
                <div class="modal-body custom-modal-body" :style="{ backgroundImage: `url(${imgUrl})` }">
                    <Transition>
                        <div class="gallery-header" v-show="isShowToolPanel">
                            <div></div>
                            <div>
                                <i class="gallery-btn bi bi-download" role="button" @click="download(imgUrl)"></i>
                                <i class="gallery-btn bi bi-x-lg ms-5" data-bs-dismiss="modal" role="button"></i>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.imagesGallery{
    cursor: pointer;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: black;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
}
.blur-sheet {
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 100%;
}
.zoom-in-icon{
    color: white;
    position: absolute;
    z-index: 3;
    bottom: 5px;
    right: 5px;
    visibility: hidden;
}
.blur-sheet:hover {
    background-color: black;
    opacity: 0.1;
}
.gallery-modal{
    height: 80%;
    max-width: 80%;
    border: 1px solid lightgray;
    margin-left: auto;
    margin-right: auto;
}
.gallery-modal .modal-content, .gallery-modal .modal-body{
    height: 100%;
}
.gallery-modal .modal-body{
    padding: 5px
}
.gallery-header{
    display: flex;
    justify-content: space-between;
    position: absolute;
    z-index: 99;
    top: 0;
    padding: 15px;
    width: 100%;
    border-bottom: 1px solid lightgray;
    background-color: black;
}
i.gallery-btn {
    color: white;
}
.custom-modal-content{
    background-color: black;
    border-radius: 0;
}
.custom-modal-body{
    display: flex;
    justify-content: center;
    padding: 0;
    cursor: default;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
    background-clip: content-box;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>