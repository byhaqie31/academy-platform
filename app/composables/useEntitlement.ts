import { usePortalDemo, type CycleState } from '~/composables/usePortalDemo'

/**
 * The gate.
 *
 * One function decides whether a child may join a class, and it always returns
 * a reason rather than a bare boolean, because "denied" is a support call and
 * "yuran Ogos belum dijelaskan" is a recovery. Every surface that shows a join
 * button reads this and nothing else.
 *
 * Note the two questions are separate and must stay separate:
 *   paidFor()  asks about money   — is this subject's invoice line settled
 *   check()    asks about access  — may the child walk in right now
 * They differ for the whole first week of the cycle, when nothing is paid yet
 * and everyone is still admitted.
 *
 * In the real system paidFor() reads invoice_lines.paid_at for the subject.
 * Here it reads the demo cycle state, but the shape of the answer is the shape
 * the backend will return.
 */
export type EntitlementReason = 'paid' | 'open' | 'grace' | 'override' | 'unpaid'

export interface Verdict {
  allowed: boolean
  reason: EntitlementReason
  /** parent-facing, Malay, always safe to render */
  message: string
}

/** Subject-level, not student-level. This is what closes the cross-subject leak. */
const UNPAID_IN_PARTIAL = 'Bahasa Inggeris'

function paid(cycle: CycleState, subject: string): boolean {
  if (cycle === 'paid') return true
  if (cycle === 'partial') return subject !== UNPAID_IN_PARTIAL
  return false
}

function verdict(cycle: CycleState, subject: string): Verdict {
  if (cycle === 'suspended') {
    return { allowed: false, reason: 'unpaid', message: 'Yuran Ogos belum dijelaskan' }
  }
  if (cycle === 'partial' && !paid(cycle, subject)) {
    return { allowed: false, reason: 'unpaid', message: 'Yuran subjek ini belum dijelaskan' }
  }
  if (cycle === 'grace') {
    return { allowed: true, reason: 'grace', message: 'Akses akan dijeda esok' }
  }
  if (paid(cycle, subject)) {
    return { allowed: true, reason: 'paid', message: '' }
  }
  // cycle is open and the due date has not passed: admitted, unpaid
  return { allowed: true, reason: 'open', message: '' }
}

// swap internals for API calls when backend lands; signature stays stable
export function useEntitlement() {
  const demo = usePortalDemo()
  return {
    /** may this child join this subject's class right now, and why */
    check: (subject: string): Verdict => verdict(demo.cycle.value, subject),
    /** is this subject's invoice line settled — a money question, not an access one */
    paidFor: (subject: string): boolean => paid(demo.cycle.value, subject),
  }
}
