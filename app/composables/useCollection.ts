import { useBilling } from '~/composables/useBilling'
import { useStudents } from '~/composables/useStudents'
import { useGuardians } from '~/composables/useGuardians'
import { useAcademy } from '~/composables/useAcademy'
import { useAdminMetrics } from '~/composables/useAdminMetrics'
import type { PayStatus } from '~/types'

export interface CollectionRow {
  guardianId: string
  guardian: string
  phone: string
  children: string
  branch: string
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
  const { branchShort } = useAcademy()
  const metrics = useAdminMetrics()

  const rows: CollectionRow[] = billing.all.map((inv, i) => {
    const student = students.byId(inv.studentId)
    const guardian = student ? guardians.forStudent(student.id) : undefined
    return {
      guardianId: guardian?.id ?? inv.id,
      guardian: guardian?.name ?? '—',
      phone: guardian?.phone ?? '—',
      children: student?.name ?? inv.name,
      branch: branchShort(inv.branchId),
      amount: inv.amount,
      status: inv.status,
      lastReminder: inv.status === 'Paid' ? '—' : i % 2 === 0 ? '5 Ogos · 09:00' : 'Not chased yet',
      lapsedBefore: i % 3 === 0 && inv.status !== 'Paid',
    }
  })

  const unpaid = rows.filter((r) => r.status !== 'Paid')

  /**
   * The seed holds an inspectable slice; the metrics block is centre-wide.
   * Scale the slice up to the real roll so the board reads like the business,
   * the way every other admin screen in this mockup already does.
   */
  const scale = metrics.activeStudents / Math.max(rows.length, 1)
  const familiesTotal = Math.round(metrics.activeStudents / 1.25)
  const familiesUnpaid = Math.round((unpaid.length * scale) / 1.25)

  return {
    rows,
    unpaid,
    board: {
      period: 'Ogos 2026',
      today: '5 Ogos',
      daysLeft: 2,
      familiesTotal,
      familiesPaid: familiesTotal - familiesUnpaid,
      familiesUnpaid,
      outstanding: Math.round(unpaid.reduce((n, r) => n + r.amount, 0) * scale),
      /** what the 8th looks like if nothing changes — the number that makes someone act on the 6th */
      projectedSuspensions: Math.round(familiesUnpaid * 1.25 * 0.76),
    },
  }
}
