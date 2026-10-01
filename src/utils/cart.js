export const isAvailableCartItem = (item) => item.isEffective !== false && item.stock !== 0

export const cartItemPrice = (item) => Number(item.nowPrice ?? item.price)
