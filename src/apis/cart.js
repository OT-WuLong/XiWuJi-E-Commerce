import httpInstance from '@/utils/http'

export function insertCartAPI({skuId, count}) {
  return httpInstance({
    url: '/member/cart',
    method: 'POST',
    data: {
      skuId,
      count
    }
  })
}

export function findNewCartListAPI() {
  return httpInstance({
    url: '/member/cart',
    method:'GET'
  })
}

export function delCartAPI(ids) {
  return httpInstance({
    url: '/member/cart',
    method: 'DELETE',
    data: {
      ids
    }
  })
}

export function updateCartItemAPI(skuId, data) {
  return httpInstance({
    url: `/member/cart/${skuId}`,
    method: 'PUT',
    data
  })
}

export function checkAllCartAPI(selected, ids) {
  return httpInstance({
    url: '/member/cart/selected',
    method: 'PUT',
    data: { selected, ids }
  })
}

export function mergeCartAPI(data){
  return httpInstance({
    url: '/member/cart/merge',
    method: 'POST',
    data
  })
}
