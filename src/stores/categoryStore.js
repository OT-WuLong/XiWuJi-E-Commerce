import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCategoryAPI } from '@/apis/layout.js'

export const useCategoryStore = defineStore('category', () => {
  const catagoryList = ref([])
  const loading = ref(true)
  const error = ref(false)
  const getCategory = async () => {
    loading.value = true
    error.value = false
    try {
      const res = await getCategoryAPI()
      catagoryList.value = res.result
    } catch {
      catagoryList.value = []
      error.value = true
    } finally {
      loading.value = false
    }
  }

  return { catagoryList, loading, error, getCategory }
})
