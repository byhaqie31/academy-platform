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

  /**
   * Seeded invoices with the walkthrough's settled payments layered on top.
   * Rebuilt per read so a payment recorded on one screen shows on every other,
   * and so the seed itself is never written to.
   */
  const all = (): Invoice[] =>
    (store.invoices as Invoice[]).map((i) =>
      store.demo.paidInvoiceIds.includes(i.id)
        ? { ...i, status: 'Paid' as PayStatus, proof: true }
        : i,
    )

  const filter = (f: BillingFilter): Invoice[] =>
    f === 'all' ? all() : all().filter((i) => i.status.toLowerCase() === f)

  const sumBy = (status: PayStatus) =>
    all().filter((i) => i.status === status).reduce((t, i) => t + i.amount, 0)

  const summary = () => ({
    paid: sumBy('Paid'),
    pending: sumBy('Pending'),
    overdue: sumBy('Overdue'),
  })

  // Three-month history derived from the student's current invoice + status.
  const paymentHistory = (studentId: string): PaymentRow[] => {
    const inv = all().find((i) => i.studentId === studentId)
    const amount = inv?.amount ?? store.metrics.defaultFee
    if (inv?.status === 'Overdue') {
      return [
        { period: 'Jun 2026', amount, status: 'Overdue', proofLabel: 'No proof · overdue', hasProof: false },
        { period: 'May 2026', amount, status: 'Paid', proofLabel: 'Receipt · 03 May', hasProof: true },
        { period: 'Apr 2026', amount, status: 'Paid', proofLabel: 'Receipt · 02 Apr', hasProof: true },
      ]
    }
    if (inv?.status === 'Pending') {
      return [
        { period: 'Jun 2026', amount, status: 'Pending', proofLabel: 'Awaiting payment proof', hasProof: false },
        { period: 'May 2026', amount, status: 'Paid', proofLabel: 'Receipt · 04 May', hasProof: true },
        { period: 'Apr 2026', amount, status: 'Paid', proofLabel: 'Receipt · 01 Apr', hasProof: true },
      ]
    }
    return [
      { period: 'Jun 2026', amount, status: 'Paid', proofLabel: 'Receipt · 02 Jun', hasProof: true },
      { period: 'May 2026', amount, status: 'Paid', proofLabel: 'Receipt · 03 May', hasProof: true },
      { period: 'Apr 2026', amount, status: 'Paid', proofLabel: 'Receipt · 01 Apr', hasProof: true },
    ]
  }

  // `all` stays a property, not a function, so callers read it unchanged.
  return {
    get all() {
      return all()
    },
    filter,
    summary,
    paymentHistory,
  }
}
