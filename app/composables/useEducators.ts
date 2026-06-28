import { useAcademyStore } from '~/stores/academy'
import type { Educator } from '~/types'

// swap internals for API calls when backend lands; signature stays stable
export function useEducators() {
  const store = useAcademyStore()
  const all = store.educators as Educator[]

  // Pay is derived from recorded sessions, never hand-entered.
  const estimatedPay = (id: string): number => {
    const e = all.find((x) => x.id === id)
    if (!e) return 0
    const hours = store.sessions
      .filter((s) => s.educatorId === id)
      .reduce((t, s) => t + s.durationHours, 0)
    return hours * e.rate
  }

  return {
    all,
    byId: (id: string) => all.find((e) => e.id === id),
    indexOf: (id: string) => all.findIndex((e) => e.id === id),
    estimatedPay,
    self: () => all.find((e) => e.id === store.tutorSelfId)!,
  }
}
