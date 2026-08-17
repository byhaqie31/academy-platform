// Content types for the public marketing website.
//
// The website is Malay for everything a visitor reads. These types, their field
// names and every identifier stay English, per the phase 1 language split.
//
// Nothing here is inlined in a component: the seed lives in
// app/stores/siteContent.ts and reaches components through composables.

import type { Stage, SubjectTone } from './index'

export interface SitePill {
  label: string
  /** renders in the warm pink treatment rather than the default lavender. */
  hot?: boolean
}

export interface SiteCta {
  label: string
  to: string
}

export interface SiteStat {
  value: string
  label: string
}

/** One row of the "kelas hari ini" card in the hero. Illustrative, not seeded sessions. */
export interface SiteClassRow {
  time: string
  subject: string
  meta: string
  tone: SubjectTone
  live?: boolean
}

export interface SiteHero {
  pills: SitePill[]
  headline: string
  /** second line, rendered in the headline gradient. */
  headlineAccent: string
  lede: string
  primary: SiteCta
  secondary: SiteCta
  stats: SiteStat[]
  todayTitle: string
  todayDay: string
  today: SiteClassRow[]
}

/** A section's eyebrow, heading and optional standfirst. */
export interface SiteSection {
  eyebrow: string
  title: string
  lede?: string
}

export interface SiteSubjectCard {
  name: string
  icon: string
  tone: SubjectTone
  /** level range on the home grid, or the stage-specific blurb on /subjects. */
  meta: string
}

export interface SiteStageGroup {
  key: Stage
  title: string
  tag: string
  subjects: SiteSubjectCard[]
}

export interface SiteStep {
  n: string
  title: string
  body: string
  tone: SubjectTone
}

export interface SiteTestimonial {
  id: string
  quote: string
  name: string
  meta: string
  tone: SubjectTone
}

/** A checklist line with a bolded lead clause. */
export interface SitePoint {
  lead: string
  body?: string
}

/** Monthly fee for one KPM stage, per subject taken. */
export interface FeeTier {
  stage: Stage
  title: string
  levels: string
  format: string
  monthly: number
}

export interface FeeDiscount {
  label: string
  note: string
}

export interface Faq {
  q: string
  a: string
}

export interface SiteNavItem {
  to: string
  label: string
}

export interface SiteFooterColumn {
  title: string
  links: SiteNavItem[]
}

/* Demo directory ---------------------------------------------------- *
 * The internal index at /demo. Not linked from the public site.        */

export type DemoStatus = 'live' | 'planned'

export interface DemoEntry {
  label: string
  /** absent while the screen is still `planned`. */
  to?: string
  /** one line saying what this screen proves. */
  note: string
  status: DemoStatus
  /** a file rather than a route: opens in a new tab, not via the router. */
  external?: boolean
}

export interface DemoGroup {
  key: string
  title: string
  /** e.g. "current", "archive", "phase 2". */
  badge?: string
  note: string
  icon: string
  tone: SubjectTone
  /** where "open this module" goes. Absent when the module is not built yet. */
  primaryTo?: string
  primaryLabel?: string
  /** primaryTo is a file rather than a route. */
  primaryExternal?: boolean
  /** The lead module: spans two columns so the grid is not seven equal tiles. */
  feature?: boolean
  entries: DemoEntry[]
}

/**
 * One "someone just registered" notice on a campaign page.
 *
 * `agoLabel` is a fixed string rather than a timestamp on purpose: the landing
 * pages are prerendered, so anything derived from the clock differs between the
 * built HTML and the browser and trips a hydration mismatch. It also keeps the
 * seed honest, in that nothing here pretends to be live.
 */
export interface SiteSignup {
  id: string
  /** Includes the honorific, e.g. "Puan Aisyah". */
  name: string
  area: string
  /** e.g. "4 minit lalu". */
  agoLabel: string
}

/** Public-facing tutor card. Never carries rate or hours: this renders on the website. */
export interface PublicEducator {
  id: string
  name: string
  initial: string
  /** joined subject list, e.g. "Bahasa Melayu dan Sejarah". */
  subjects: string
  years: number
  bio: string
  tone: SubjectTone
}
