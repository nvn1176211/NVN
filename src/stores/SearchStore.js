import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useFetch } from '../composables/fetch'

export const useSearchStore = defineStore('search', () => {
  const data = ref([])
  // const quantity = ref(null)
  const search = ref(null)
  const isLoading = ref(true)
  let canLoadMore = true
  const from = ref(0)
  const size = 8
  let api_token = helpers.getCookie('api_token')
  const searchUrl = ref(`${env.API_BASE}/pages?search=${search.value ?? ''}&from=${from.value}&size=${size}&api_token=${api_token ?? ''}`)
  const fetch = useFetch(searchUrl)
  watch(search, (newVal) => {
    data.value = []
    from.value = 0
    canLoadMore = true
    searchUrl.value = `${env.API_BASE}/pages?search=${newVal ?? ''}&from=${from.value}&size=${size}&api_token=${api_token ?? ''}`
  })
  watch(from, (newVal) => {
    searchUrl.value = `${env.API_BASE}/pages?search=${search.value ?? ''}&from=${newVal}&size=${size}&api_token=${api_token ?? ''}`
  })
  watch(() => fetch.data.value, (newVal) => {
    isLoading.value = false
    if(newVal && newVal.pages && newVal.pages.length > 0){
      data.value = data.value.concat(newVal.pages)
      canLoadMore = true
      // quantity.value = newVal ? (newVal.pages ? newVal.pages.length : 0) : 0
    }
  }, { immediate: true })

  function $loadMore() {
    if (!canLoadMore) return false
    from.value += size
    isLoading.value = true
    canLoadMore = false
  }

  function $reset() {
    search.value = null
    data.value = []
    from.value = 0
    canLoadMore = true
    // quantity.value = null
  }
  return { data, search, from, isLoading, $reset, $loadMore }
})