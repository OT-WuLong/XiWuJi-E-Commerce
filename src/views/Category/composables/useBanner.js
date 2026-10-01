import { ref, onMounted } from 'vue'
import { getBannerAPI } from '@/apis/home'

export function useBanner() {
  const bannerList = ref([])
  const getBanner = async () => {
    try {
      const res = await getBannerAPI({ distributionSite: '2' })
      bannerList.value = res.result
    } catch {
      bannerList.value = []
    }
  }

  onMounted(() => {
    getBanner()
  })

  return {
    bannerList
  }
}
