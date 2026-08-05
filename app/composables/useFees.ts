import { useAcademyStore } from '~/stores/academy'
import type { FeeDiscount, FeeTier, Stage } from '~/types'

// swap internals for API calls when backend lands; signature stays stable
/**
 * Published fees for the public website. Read-only and derived: this is the
 * price list a parent sees, not a billing calculation. Nothing here is wired to
 * an input, per the "money is handled with care" rule.
 *
 * Amounts are ILLUSTRATIVE and not confirmed by Hz.
 */
export function useFees() {
  const store = useAcademyStore()
  const tiers = store.feeTiers as FeeTier[]
  return {
    tiers,
    forStage: (stage: Stage) => tiers.find((t) => t.stage === stage),
    includes: store.feeIncludes as string[],
    discounts: store.feeDiscounts as FeeDiscount[],
    discountLede: store.feeDiscountLede,
    paymentNote: store.feePaymentNote,
  }
}
