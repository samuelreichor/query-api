import { ref, isRef, watch, type Ref } from 'vue'

export function useFetch<T = unknown>(url: string | Ref<string>, authToken: string) {
  const reactiveUrl = isRef(url) ? url : ref(url)
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(true)

  const fetchData = async () => {
    try {
      const response = await fetch(reactiveUrl.value, {
        headers: { Authorization: authToken },
      })

      if (!response.ok) {
        throw new Error(`Fetch failed: ${response.statusText}`)
      }

      data.value = await response.json()
    } catch (err) {
      error.value = err as Error
      data.value = null
    } finally {
      loading.value = false
    }
  }

  watch(reactiveUrl, fetchData, { immediate: true })

  return { data, error, loading }
}
