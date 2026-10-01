import assert from 'node:assert/strict'
import test from 'node:test'
import { useApiData } from '../src/composables/useApiData.js'

test('request state can recover after a failed load', async () => {
  let fail = true
  const state = useApiData(async () => {
    if (fail) throw new Error('offline')
    return { result: ['item'] }
  })

  await state.load()
  assert.equal(state.error.value, true)
  assert.equal(state.loading.value, false)
  assert.deepEqual(state.data.value, [])

  fail = false
  await state.load()
  assert.equal(state.error.value, false)
  assert.deepEqual(state.data.value, ['item'])
})
