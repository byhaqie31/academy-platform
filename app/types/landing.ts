// Campaign landing page types.
//
// A landing page is one ad campaign's page. It has no navigation and one exit,
// and everything that varies between campaigns lives in a data file under
// app/content/landings/. Adding a campaign must never require a component edit.

import type { Stage } from './index'

/**
 * Slug convention: `<level>-<subject>-<campaign>`, e.g. `ma-matematik-august`.
 *
 * The same string is the file name, the route slug, the Pixel content_name, the
 * UTM campaign value and the enquiry tag. One string end to end means the ad
 * platform and the enquiry list agree without anyone reconciling by hand.
 *
 * The template literal enforces the shape; `test/content/landings.spec.ts`
 * enforces that the parts actually match the campaign's own level, subject and
 * campaign fields, which a type cannot check.
 */
export type LandingSlug = `${Stage}-${string}-${string}`

export interface LandingCta {
  label: string
  /** `both` shows the form and the WhatsApp button; the others show one. */
  mode: 'both' | 'form' | 'whatsapp'
}

export interface LandingTrial {
  label: string
  note: string
}

export interface LandingOffer {
  tag: string
  price: number
  period: string
  schedule: string
  includes: string[]
  seatsTotal: number
  seatsTaken: number
  trial: LandingTrial
}

export interface LandingProof {
  /** keys into the shared stat pool. */
  stats: string[]
  /** keys into the shared testimonial pool. */
  testimonials: string[]
}

export interface LandingForm {
  levelOptions: string[]
}

export interface LandingSeo {
  title: string
  description: string
}

export interface LandingCampaign {
  slug: LandingSlug
  level: Stage
  subject: string
  campaign: string

  pills: string[]
  headline: string
  /** second line, rendered in the headline gradient. */
  headlineAccent: string
  subheadline: string

  cta: LandingCta
  offer: LandingOffer
  proof: LandingProof
  included: string[]
  /** keys into the shared FAQ pool. */
  faqs: string[]
  form: LandingForm
  seo: LandingSeo
}

/** A headline number in the hero, resolved from `proof.stats`. */
export interface LandingStat {
  value: string
  label: string
}
