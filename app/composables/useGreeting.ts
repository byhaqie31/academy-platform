import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

// Malay day and month names, spelled to match the rest of the app (Jun, Julai, Ogos).
const DAYS = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu']
const MONTHS = [
  'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
  'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember',
]

/**
 * Live greeting + date driven by the system clock. Refreshes every 30s so the
 * greeting flips at hour boundaries and the date rolls over at midnight while
 * the demo is left open. SPA-only app, so this always runs on the client.
 */
export function useGreeting() {
  const now = ref(new Date())
  let timer: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    now.value = new Date()
    timer = setInterval(() => (now.value = new Date()), 30_000)
  })
  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })

  // pagi 05:00–11:59 · petang 12:00–18:59 · malam 19:00–04:59
  const greeting = computed(() => {
    const h = now.value.getHours()
    if (h >= 5 && h < 12) return 'Selamat pagi'
    if (h >= 12 && h < 19) return 'Selamat petang'
    return 'Selamat malam'
  })

  const dateLabel = computed(() => {
    const d = now.value
    return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
  })

  return { now, greeting, dateLabel }
}
