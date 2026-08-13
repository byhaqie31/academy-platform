import { useAcademyStore } from '~/stores/academy'

// Dashboard tiles. Headline aggregates are centre-wide metric constants (the
// real centre is larger than the inspectable seed slice); per-record figures
// like outstanding invoices still derive from the seed where shown.
// swap internals for API calls when backend lands; signature stays stable
export function useAdminMetrics() {
  const store = useAcademyStore()
  const m = store.metrics

  /**
   * Headline figures are centre-wide constants, so a walkthrough payment applies
   * a delta rather than recomputing from the seed slice. Exposed as getters so
   * a screen reading `metrics.outstanding` re-evaluates when the overlay changes.
   */
  const settled = () =>
    store.demo.paidInvoiceIds.reduce(
      (total, id) => total + (store.invoices.find((i) => i.id === id)?.amount ?? 0),
      0,
    )

  return {
    enquiries: m.newEnquiries,
    get activeStudents() {
      return m.activeStudents + store.demo.registeredStudents.length
    },
    classesToday: m.classesToday,
    get outstanding() {
      return m.outstanding - settled()
    },
    get outstandingCount() {
      return m.outstandingCount - store.demo.paidInvoiceIds.length
    },
    revenue: m.revenue,
    cost: m.cost,
    margin: m.margin,
    marginPct: m.marginPct,
    payrollTotal: m.payrollTotal,
    totalHours: m.totalHours,
    branchesActive: m.branchesActive,
    classesActive: m.classesActive,
    adminAccounts: m.adminAccounts,
    defaultFee: m.defaultFee,
  }
}
