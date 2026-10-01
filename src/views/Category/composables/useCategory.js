import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getCategoryAPI } from '@/apis/category'


export function useCategory() {
  const route = useRoute()
  const categoryData = ref({})
  const loading = ref(true)
  const loadError = ref(false)
  let requestId = 0
  const getCategory = async (id) => {
    const currentRequest = ++requestId
    categoryData.value = {}
    loading.value = true
    loadError.value = false
    try {
      const res = await getCategoryAPI(id)
      if (currentRequest === requestId) categoryData.value = res.result
    } catch {
      if (currentRequest === requestId) loadError.value = true
    } finally {
      if (currentRequest === requestId) loading.value = false
    }
  }
  watch(() => route.params.id, getCategory, { immediate: true })

  return {
    categoryData,
    loading,
    loadError,
    retry: () => getCategory(route.params.id)
  }
}
