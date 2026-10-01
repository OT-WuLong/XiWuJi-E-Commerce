import assert from 'node:assert/strict'
import test from 'node:test'
import { formatCountdown, secondsRemaining } from '../src/composables/useCountDown.js'

test('countdown stays at zero and preserves durations over an hour', () => {
  assert.equal(secondsRemaining(1500, 0), 2)
  assert.equal(secondsRemaining(1000, 2000), 0)
  assert.equal(formatCountdown(0), '00分00秒')
  assert.equal(formatCountdown(3601), '60分01秒')
})
