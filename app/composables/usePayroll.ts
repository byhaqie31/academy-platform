import { useAcademyStore } from '~/stores/academy'
import type { PayrollRun } from '~/types'

// swap internals for API calls when backend lands; signature stays stable
export function usePayroll() {
  const store = useAcademyStore()

  const hoursFor = (educatorId: string) =>
    store.sessions
      .filter((s) => s.educatorId === educatorId)
      .reduce((t, s) => t + s.durationHours, 0)

  const rateFor = (educatorId: string) =>
    store.educators.find((e) => e.id === educatorId)?.rate ?? 0

  const runFor = (educatorId: string, period: string): PayrollRun => {
    const hours = hoursFor(educatorId)
    const rate = rateFor(educatorId)
    return { educatorId, period, hours, rate, amount: hours * rate }
  }

  // Hours per week, in store.weekStarts order.
  const weeklyBreakdown = (educatorId: string): number[] =>
    store.weekStarts.map((wk) =>
      store.sessions
        .filter((s) => s.educatorId === educatorId && s.date === wk)
        .reduce((t, s) => t + s.durationHours, 0),
    )

  // Hours and RM per class, in class order of first appearance.
  const byClass = (educatorId: string) => {
    const rate = rateFor(educatorId)
    const order: string[] = []
    const sums: Record<string, number> = {}
    for (const s of store.sessions.filter((x) => x.educatorId === educatorId)) {
      if (!(s.classId in sums)) {
        sums[s.classId] = 0
        order.push(s.classId)
      }
      sums[s.classId]! += s.durationHours
    }
    return order.map((classId) => ({
      classId,
      hours: sums[classId]!,
      amount: sums[classId]! * rate,
    }))
  }

  return { runFor, weeklyBreakdown, byClass, hoursFor, weekLabels: store.weekLabels }
}
