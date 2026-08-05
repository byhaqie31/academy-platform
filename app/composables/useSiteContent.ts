import { useAcademyStore } from '~/stores/academy'
import type {
  SiteHero,
  SitePoint,
  SiteSection,
  SiteStageGroup,
  SiteStep,
  SiteSubjectCard,
  SiteTestimonial,
} from '~/types'

// swap internals for API calls when backend lands; signature stays stable
/**
 * Copy for the public marketing website, grouped by the page that renders it.
 *
 * Every visible string on the six website pages comes through here. Components
 * hold layout and styling only. When a CMS lands, this composable changes and
 * the pages do not.
 */
export function useSiteContent() {
  const store = useAcademyStore()
  return {
    home: {
      hero: store.siteHero as SiteHero,
      trustClaims: store.siteTrustClaims as string[],
      subjectsSection: store.siteHomeSubjectsSection as SiteSection,
      subjects: store.siteHomeSubjects as SiteSubjectCard[],
      stepsSection: store.siteHomeStepsSection as SiteSection,
      steps: store.siteHomeSteps as SiteStep[],
      cta: store.siteHomeCta,
    },
    subjects: {
      section: store.siteSubjectsSection as SiteSection,
      note: store.siteSubjectsNote as SitePoint,
    },
    howItWorks: {
      section: store.siteHowSection as SiteSection,
      points: store.siteHowPoints as SitePoint[],
      whatYouNeed: store.siteWhatYouNeed,
      firstWeekSection: store.siteFirstWeekSection as SiteSection,
      firstWeekSteps: store.siteFirstWeekSteps as SiteStep[],
    },
    tutors: {
      section: store.siteTutorsSection as SiteSection,
      note: store.siteTutorsNote as SitePoint,
    },
    fees: {
      section: store.siteFeesSection as SiteSection,
    },
    contact: {
      section: store.siteContactSection as SiteSection,
      officeHours: store.siteOfficeHours as string[],
      whatsAppMessage: store.siteWhatsAppMessage,
      enquiryLevels: store.siteEnquiryLevels as string[],
      consentLabel: store.siteConsentLabel,
    },
    faqSection: store.siteFaqSection as SiteSection,
    /** Shared with the landing pages in spec B; pick a subset by id. */
    testimonials: store.siteTestimonials as SiteTestimonial[],
    testimonialsSection: store.siteTestimonialsSection as SiteSection,
    stageGroups: store.siteStageGroups as SiteStageGroup[],
  }
}
