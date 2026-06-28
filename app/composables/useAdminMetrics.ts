import { useAcademyStore } from '~/stores/academy'

// Dashboard tiles. Headline aggregates are centre-wide metric constants (the
// real centre is larger than the inspectable seed slice); per-record figures
// like outstanding invoices still derive from the seed where shown.
// swap internals for API calls when backend lands; signature stays stable
export function useAdminMetrics() {
  const store = useAcademyStore()
  const m = store.metrics
  return {
    enquiries: m.newEnquiries,
    activeStudents: m.activeStudents,
    classesToday: m.classesToday,
    outstanding: m.outstanding,
    outstandingCount: m.outstandingCount,
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
