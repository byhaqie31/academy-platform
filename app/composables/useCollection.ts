import { useBilling } from '~/composables/useBilling'
import { useStudents } from '~/composables/useStudents'
import { useGuardians } from '~/composables/useGuardians'
import { useAdminMetrics } from '~/composables/useAdminMetrics'
import { useDemoActions } from '~/composables/useDemoActions'
import type { PayStatus } from '~/types'

export interface CollectionRow {
  guardianId: string
  guardian: string
  phone: string
  children: string
  amount: number
  status: PayStatus
  lastReminder: string
  lapsedBefore: boolean
}

/**
 * The 1st to the 7th, which is the whole month's revenue in seven days.
 *
 * Counted in guardians, not students, because that is what an invoice belongs
 * to. A family paying three times a month will miss one.
 */
// swap internals for API calls when backend lands; signature stays stable
export function useCollection() {
  const billing = useBilling()
  const students = useStudents()
  const guardians = useGuardians()
  const metrics = useAdminMetrics()
  const demo = useDemoActions()

  // Built per read rather than once at setup, so a payment recorded anywhere in
  // the walkthrough shows here too.
  const rows = (): CollectionRow[] =>
    billing.all.map((inv, i) => {
      const student = students.byId(inv.studentId)
      const guardian = student ? guardians.forStudent(student.id) : undefined
      const guardianId = guardian?.id ?? inv.id
      const seededReminder =
        inv.status === 'Paid' ? '—' : i % 2 === 0 ? '5 Ogos · 09:00' : 'Not chased yet'
      return {
        guardianId,
        guardian: guardian?.name ?? '—',
        phone: guardian?.phone ?? '—',
        children: student?.name ?? inv.name,
        amount: inv.amount,
        status: inv.status,
        lastReminder: demo.wasChased(guardianId) ? 'Just now' : seededReminder,
        lapsedBefore: i % 3 === 0 && inv.status !== 'Paid',
      }
    })

  const unpaid = () => rows().filter((r) => r.status !== 'Paid')

  /**
   * The seed holds an inspectable slice; the metrics block is centre-wide.
   * Scale the slice up to the real roll so the board reads like the business,
   * the way every other admin screen in this mockup already does.
   */
  const board = () => {
    const allRows = rows()
    const notPaid = unpaid()
    const scale = metrics.activeStudents / Math.max(allRows.length, 1)
    const familiesTotal = Math.round(metrics.activeStudents / 1.25)
    const familiesUnpaid = Math.round((notPaid.length * scale) / 1.25)
    return {
      period: 'Ogos 2026',
      today: '5 Ogos',
      daysLeft: 2,
      familiesTotal,
      familiesPaid: familiesTotal - familiesUnpaid,
      familiesUnpaid,
      outstanding: Math.round(notPaid.reduce((n, r) => n + r.amount, 0) * scale),
      /** what the 8th looks like if nothing changes, the number that makes someone act on the 6th */
      projectedSuspensions: Math.round(familiesUnpaid * 1.25 * 0.76),
    }
  }

  // Properties, not functions, so callers read them unchanged.
  return {
    get rows() {
      return rows()
    },
    get unpaid() {
      return unpaid()
    },
    get board() {
      return board()
    },
  }
}
