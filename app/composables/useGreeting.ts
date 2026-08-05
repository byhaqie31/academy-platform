import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { Day } from '~/types'

// Indexed by Date.getDay(), so this MUST start at Sunday. Not the same array
// as useSchedule's DAYS, which is Monday-first grid column order.
const DAYS: Day[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
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

  // morning 05:00–11:59 · afternoon 12:00–18:59 · evening 19:00–04:59
  const greeting = computed(() => {
    const h = now.value.getHours()
    if (h >= 5 && h < 12) return 'Good morning'
    if (h >= 12 && h < 19) return 'Good afternoon'
    return 'Good evening'
  })

  const dateLabel = computed(() => {
    const d = now.value
    return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
  })

  return { now, greeting, dateLabel }
}
