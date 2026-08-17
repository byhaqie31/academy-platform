import { useAcademyStore } from '~/stores/academy'
import type { SiteSignup } from '~/types'

// swap internals for API calls when backend lands; signature stays stable
/**
 * Recent registrations for the "someone just registered" notices on a campaign
 * page.
 *
 * THE POOL IS SEEDED, NOT REAL. This composable is the one place that changes
 * when a backend exists: point `recent` at genuine recent enquiries and the
 * component above it does not move. Until then, treat anything it returns as
 * unfit for a live ad. See the note on `siteRecentSignups`.
 */
export function useSocialProof() {
  const store = useAcademyStore()
  return {
    recent: store.siteRecentSignups as SiteSignup[],
  }
}
