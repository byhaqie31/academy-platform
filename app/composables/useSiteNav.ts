import { useAcademyStore } from '~/stores/academy'
import type { SiteFooterColumn, SiteNavItem } from '~/types'

// swap internals for API calls when backend lands; signature stays stable
/**
 * Navigation for the public marketing website.
 *
 * Separate from usePortalNav: marketing is not a portal, and the portal login
 * deliberately appears only in `portalLink` (the footer), never in the header.
 */
export function useSiteNav() {
  const store = useAcademyStore()
  return {
    items: store.siteNav as SiteNavItem[],
    cta: store.siteCta as SiteNavItem,
    brandSub: store.siteBrandSub,
    footerColumns: store.siteFooterColumns as SiteFooterColumn[],
    footerBlurb: store.siteFooterBlurb,
    portalLink: store.sitePortalLink,
  }
}
