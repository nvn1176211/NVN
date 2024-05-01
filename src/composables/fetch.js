import { ref, watch, toValue } from 'vue'

export function useFetch(url) {
    const data = ref(null)
    const error = ref(null)
    const isRequesting = ref(false)
    let timerAction;

    function load(excuteUrl) {
        if (isRequesting.value) return false;
        isRequesting.value = true
        data.value = null
        error.value = null
        fetch(toValue(excuteUrl))
            .then((res) => res.json())
            .then((json) => {
                data.value = json
                isRequesting.value = false
            })
            .catch((err) => (error.value = err))
    }

    watch(url, (newUrl) => {
        if(timerAction){
            clearTimeout(timerAction);
        }
        timerAction = setTimeout(() => {
            load(newUrl)
        }, 500);
    },
        { immediate: true }
    );

    return { data, error, isRequesting }
}