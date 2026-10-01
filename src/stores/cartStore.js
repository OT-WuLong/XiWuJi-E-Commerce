import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './userStore'
import { insertCartAPI, findNewCartListAPI, delCartAPI, updateCartItemAPI, checkAllCartAPI } from '@/apis/cart'
import { cartItemPrice, isAvailableCartItem } from '@/utils/cart'

export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore()
  const isLogin = computed(() => userStore.userInfo.token)
  const cartList = ref([])
  const addCart = async (goods) => {
    const { skuId, count } = goods
    if (isLogin.value) {
      await insertCartAPI({ skuId, count })
      await updateNewList()
    } else {
      const item = cartList.value.find((item) => goods.skuId === item.skuId)
      if (item) {
        const stock = Number(goods.stock ?? item.stock)
        if (Number.isFinite(stock) && item.count + count > stock) throw new RangeError('库存不足')
        item.count += goods.count
        item.price = goods.price
        item.stock = goods.stock
      } else {
        cartList.value.push(goods)
      }
    }
  }
  const delCart = async (skuId) => {
    if (isLogin.value) {
      await delCartAPI([skuId])
      await updateNewList()
    } else {
      const idx = cartList.value.findIndex((item) => skuId === item.skuId)
      if (idx !== -1) cartList.value.splice(idx, 1)
    }

  }
  const clearCart = () => {
    cartList.value = []
  }
  const singleCheck = async (skuId, selected) => {
    const item = cartList.value.find((item) => item.skuId === skuId)
    if (!item || !isAvailableCartItem(item)) return
    if (isLogin.value) await updateCartItemAPI(skuId, { selected })
    item.selected = selected
  }
  const allCheck = async (selected) => {
    if (isLogin.value) await checkAllCartAPI(selected, availableItems.value.map((item) => item.skuId))
    availableItems.value.forEach((item) => item.selected = selected)
  }
  const changeCount = async (skuId, count) => {
    const item = cartList.value.find((item) => item.skuId === skuId)
    if (!item || !isAvailableCartItem(item) || !Number.isInteger(count) || count < 1 || (item.stock != null && count > item.stock)) return
    if (isLogin.value) await updateCartItemAPI(skuId, { count })
    item.count = count
  }
  const updateNewList = async () => {
    const res = await findNewCartListAPI()
    cartList.value = res.result
  }

  const availableItems = computed(() => cartList.value.filter(isAvailableCartItem))
  const selectedItems = computed(() => availableItems.value.filter((item) => item.selected))
  const allCount = computed(() => cartList.value.reduce((a, c) => a + c.count, 0))
  const availableCount = computed(() => availableItems.value.reduce((a, c) => a + c.count, 0))
  const allPrice = computed(() => availableItems.value.reduce((a, c) => a + c.count * cartItemPrice(c), 0))
  const isAll = computed(() => availableItems.value.length > 0 && availableItems.value.every((item) => item.selected))
  const selectedCount = computed(() => selectedItems.value.reduce((a, c) => a + c.count, 0))
  const selectedPrice = computed(() => selectedItems.value.reduce((a, c) => a + c.count * cartItemPrice(c), 0))
  return { cartList, availableItems, addCart, delCart, allCount, availableCount, allPrice, singleCheck, isAll, allCheck, changeCount, selectedCount, selectedPrice, clearCart, updateNewList }
}, { persist: true }
)
