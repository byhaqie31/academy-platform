import { ref } from 'vue'
import type { Day } from '~/types'

/**
 * Demo-only UI state for the portal walkthrough.
 *
 * This is not domain data, so it deliberately does not live in the seeded
 * Pinia store. It exists so a demo can show every state of the billing cycle
 * in front of a client without a backend, a clock, or an edited seed.
 */
export type CycleState = 'paid' | 'due' | 'final' | 'partial' | 'grace' | 'suspended'

export interface CycleStep {
  key: CycleState
  label: string
  day: string
  hint: string
}

/** The billing cycle, in the order a month actually runs. */
export const cycleSteps: CycleStep[] = [
  { key: 'paid', label: 'Sudah bayar', day: '2 Ogos', hint: 'Everything settled, the calm state' },
  { key: 'due', label: 'Belum bayar', day: '4 Ogos', hint: 'Cycle open, three days left' },
  { key: 'final', label: 'Hari akhir', day: '7 Ogos', hint: 'Due today, escalated weight' },
  { key: 'partial', label: 'Bayar separa', day: '7 Ogos', hint: 'Two subjects paid, one not' },
  { key: 'grace', label: 'Tempoh lanjut', day: '8 Ogos', hint: 'Past due, inside the grace window' },
  { key: 'suspended', label: 'Akses disekat', day: '9 Ogos', hint: 'The gate closed, the recovery screen' },
]

const cycle = ref<CycleState>('due')

// swap internals for API calls when backend lands; signature stays stable
export function usePortalDemo() {
  return {
    cycle,
    steps: cycleSteps,
    set: (next: CycleState) => {
      cycle.value = next
    },
    /** the weekday the demo is standing on, chosen so a child has two classes */
    today: 'Sat' as Day,
    /** the same day as a parent-facing label; keep it consistent with `today` */
    todayLabel: 'Sabtu, 8 Ogos',
    stepFor: (key: CycleState) => cycleSteps.find((s) => s.key === key)!,
  }
}
