import { useAcademyStore } from '~/stores/academy'
import type { PayrollRun, SubjectTone } from '~/types'

/** A payroll run with the identity the admin table shows alongside it. */
export interface PayrollBoardRow extends PayrollRun {
  name: string
  first: string
  subjects: string[]
  tone: SubjectTone
}

export interface PayrollBoard {
  period: string
  rows: PayrollBoardRow[]
  total: number
  hours: number
}

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

  /**
   * The whole centre's payroll for a period, one row per educator.
   *
   * Every figure is derived from recorded sessions here, exactly as the tutor's
   * own payslip derives it, which is what makes the two screens reconcile.
   */
  const board = (period: string): PayrollBoard => {
    const rows: PayrollBoardRow[] = store.educators.map((e) => ({
      ...runFor(e.id, period),
      name: e.name,
      first: e.first,
      subjects: e.subjects,
      tone: e.tone,
    }))
    return {
      period,
      rows,
      total: rows.reduce((t, r) => t + r.amount, 0),
      hours: rows.reduce((t, r) => t + r.hours, 0),
    }
  }

  return { runFor, weeklyBreakdown, byClass, hoursFor, board, weekLabels: store.weekLabels }
}
