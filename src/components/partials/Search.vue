<script setup>
import { ref, watch } from 'vue';
import { useSearchStore } from '../../stores/SearchStore';

const searchStore = useSearchStore();
const searchVal = ref(null);
watch(searchVal, (newSearchVal) => {
  searchStore.search = newSearchVal
})
</script>

<template>
    <input id="t-search-i" class="form-control" type="text"
        :placeholder="$t('messages.search')" code-val="" v-model="searchVal">
</template>