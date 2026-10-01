import assert from 'node:assert/strict'
import test from 'node:test'
import { cartItemPrice, isAvailableCartItem } from '../src/utils/cart.js'

test('cart excludes invalid and out-of-stock items from checkout', () => {
  assert.equal(isAvailableCartItem({ isEffective: false, stock: 10 }), false)
  assert.equal(isAvailableCartItem({ isEffective: true, stock: 0 }), false)
  assert.equal(isAvailableCartItem({ price: 10 }), true)
  assert.equal(cartItemPrice({ price: 10, nowPrice: '8.50' }), 8.5)
  assert.equal(cartItemPrice({ price: 10 }), 10)
})
