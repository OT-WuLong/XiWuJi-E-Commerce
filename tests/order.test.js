import assert from 'node:assert/strict'
import test from 'node:test'
import { isPaidOrderState } from '../src/utils/order.js'

test('only confirmed paid order states show payment success', () => {
  assert.equal(isPaidOrderState(1), false)
  assert.equal(isPaidOrderState(2), true)
  assert.equal(isPaidOrderState(5), true)
  assert.equal(isPaidOrderState(6), false)
  assert.equal(isPaidOrderState(undefined), false)
})
