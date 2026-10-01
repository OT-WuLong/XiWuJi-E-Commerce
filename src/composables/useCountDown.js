import { computed, onUnmounted, ref } from 'vue'

export const secondsRemaining = (deadline, now = Date.now()) =>
  Math.max(0, Math.ceil((deadline - now) / 1000))

export const formatCountdown = (seconds) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}分${String(seconds % 60).padStart(2, '0')}秒`

export function useCountDown() {
  const time = ref(0)
  let timer = null
  const formatTime = computed(() => formatCountdown(time.value))

  const start = (seconds) => {
    clearInterval(timer)
    const deadline = Date.now() + Math.max(0, Number(seconds) || 0) * 1000
    const tick = () => {
      time.value = secondsRemaining(deadline)
      if (time.value === 0) clearInterval(timer)
    }
    tick()
    if (time.value > 0) timer = setInterval(tick, 1000)
  }

  onUnmounted(() => clearInterval(timer))
  return { formatTime, remaining: time, start }
}
