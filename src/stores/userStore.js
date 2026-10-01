import { ref } from 'vue'
import { defineStore } from 'pinia'

import { loginAPI } from '@/apis/user'
import { useCartStore } from './cartStore'
import { mergeCartAPI } from '@/apis/cart'

export const useUserStore = defineStore('user', () => {
  const cartStore = useCartStore()
  const userInfo = ref({})
  const getUserInfo = async ({ account, password }) => {
    const res = await loginAPI({ account, password })
    const guestCart = cartStore.cartList.map(item => ({
      skuId: item.skuId,
      selected: item.selected,
      count: item.count
    }))
    userInfo.value = res.result
    try {
      if (guestCart.length) await mergeCartAPI(guestCart)
    } catch (error) {
      userInfo.value = {}
      throw error
    }
    try {
      await cartStore.updateNewList()
      return true
    } catch {
      return false
    }
  }
  const clearuserInfo = () => {
    userInfo.value = {}
    cartStore.clearCart()
  }
  return { userInfo, getUserInfo, clearuserInfo }
},
  {
    persist:true
  }
)
