import { useAcademyStore } from '~/stores/academy'
import type { Invoice, PayStatus } from '~/types'

export type BillingFilter = 'all' | 'paid' | 'pending' | 'overdue'

export interface PaymentRow {
  period: string
  amount: number
  status: PayStatus
  proofLabel: string
  hasProof: boolean
}

// swap internals for API calls when backend lands; signature stays stable
export function useBilling() {
  const store = useAcademyStore()
  const all = store.invoices as Invoice[]

  const filter = (f: BillingFilter): Invoice[] =>
    f === 'all' ? all : all.filter((i) => i.status.toLowerCase() === f)

  const sumBy = (status: PayStatus) =>
    all.filter((i) => i.status === status).reduce((t, i) => t + i.amount, 0)

  const summary = () => ({
    paid: sumBy('Paid'),
    pending: sumBy('Pending'),
    overdue: sumBy('Overdue'),
  })

  // Three-month history derived from the student's current invoice + status.
  const paymentHistory = (studentId: string): PaymentRow[] => {
    const inv = all.find((i) => i.studentId === studentId)
    const amount = inv?.amount ?? store.metrics.defaultFee
    if (inv?.status === 'Overdue') {
      return [
        { period: 'Jun 2026', amount, status: 'Overdue', proofLabel: 'Tiada bukti · tertunggak', hasProof: false },
        { period: 'Mei 2026', amount, status: 'Paid', proofLabel: 'Resit · 03 Mei', hasProof: true },
        { period: 'Apr 2026', amount, status: 'Paid', proofLabel: 'Resit · 02 Apr', hasProof: true },
      ]
    }
    if (inv?.status === 'Pending') {
      return [
        { period: 'Jun 2026', amount, status: 'Pending', proofLabel: 'Menunggu bukti bayaran', hasProof: false },
        { period: 'Mei 2026', amount, status: 'Paid', proofLabel: 'Resit · 04 Mei', hasProof: true },
        { period: 'Apr 2026', amount, status: 'Paid', proofLabel: 'Resit · 01 Apr', hasProof: true },
      ]
    }
    return [
      { period: 'Jun 2026', amount, status: 'Paid', proofLabel: 'Resit · 02 Jun', hasProof: true },
      { period: 'Mei 2026', amount, status: 'Paid', proofLabel: 'Resit · 03 Mei', hasProof: true },
      { period: 'Apr 2026', amount, status: 'Paid', proofLabel: 'Resit · 01 Apr', hasProof: true },
    ]
  }

  return { all, filter, summary, paymentHistory }
}
