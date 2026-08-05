import { useAcademyStore } from '~/stores/academy'
import { landingCampaigns } from '~/content/landings'
import { useFaqs } from '~/composables/useFaqs'
import type {
  Faq,
  LandingCampaign,
  LandingStat,
  SiteSection,
  SiteStep,
  SiteTestimonial,
} from '~/types'

// swap internals for API calls when backend lands; signature stays stable
/**
 * Campaign landing pages.
 *
 * Components never import the registry directly, so when @nuxt/content or a CMS
 * arrives only the internals here change. `resolve()` turns a campaign's keys
 * into the objects a page renders, which is what keeps campaign files small
 * enough that a marketer could write one.
 */
export function useLandings() {
  const store = useAcademyStore()
  const { byKeys } = useFaqs()

  const all = (): LandingCampaign[] => Object.values(landingCampaigns)

  const bySlug = (slug: string): LandingCampaign | undefined => landingCampaigns[slug]

  /** Resolve a campaign's key references against the shared pools. */
  const resolve = (campaign: LandingCampaign) => {
    const statPool = store.landingStats as Record<string, LandingStat>
    const pool = store.siteTestimonials as SiteTestimonial[]

    return {
      // Unknown keys are dropped rather than throwing: a typo in a campaign
      // file should cost one card, not the whole page.
      stats: campaign.proof.stats
        .map((k) => statPool[k])
        .filter((s): s is LandingStat => Boolean(s)),
      testimonials: campaign.proof.testimonials
        .map((id) => pool.find((t) => t.id === id))
        .filter((t): t is SiteTestimonial => Boolean(t)),
      faqs: byKeys(campaign.faqs) as Faq[],
      seatsLeft: Math.max(0, campaign.offer.seatsTotal - campaign.offer.seatsTaken),
      seatsPct: campaign.offer.seatsTotal > 0
        ? Math.round((campaign.offer.seatsTaken / campaign.offer.seatsTotal) * 100)
        : 0,
    }
  }

  return {
    all,
    bySlug,
    resolve,
    slugs: () => Object.keys(landingCampaigns),
    /** Chrome shared by every campaign. */
    chrome: {
      trustClaims: store.landingTrustClaims as string[],
      howSection: store.landingHowSection as SiteSection,
      howSteps: store.landingHowSteps as SiteStep[],
      includedSection: store.landingIncludedSection as SiteSection,
      offer: store.landingOfferCopy,
      finalSection: store.landingFinalSection as SiteSection,
      formLabels: store.landingFormLabels,
      footerNote: store.landingFooterNote,
      seatsLabel: store.landingSeatsLabel,
      proofSection: store.siteTestimonialsSection as SiteSection,
      faqSection: store.siteFaqSection as SiteSection,
      consentLabel: store.siteConsentLabel,
    },
  }
}
