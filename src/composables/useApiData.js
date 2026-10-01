import { ref } from 'vue'

export function useApiData(request) {
  const data = ref([])
  const loading = ref(true)
  const error = ref(false)

  const load = async (...args) => {
    loading.value = true
    error.value = false
    try {
      const res = await request(...args)
      data.value = res.result ?? []
    } catch {
      data.value = []
      error.value = true
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, load }
}
