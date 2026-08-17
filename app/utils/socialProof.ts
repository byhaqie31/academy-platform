import type { SiteSignup } from '~/types'

// The "someone just registered" notices on a campaign page.
//
// Everything here is pure so the cadence is testable without a browser. The
// component owns the timers; this owns what a notice says and when the next
// one is due.

/** What someone on the page actually experiences: one toast every 15s. */
export const SOCIAL_PROOF_CYCLE_MS = 15_000

export const SOCIAL_PROOF_TIMING = {
  /** Opens sooner than it repeats: a landing visit is usually short. */
  firstDelayMs: 5_000,
  visibleMs: 5_000,
  /**
   * Gap measured from one toast CLEARING to the next appearing, not from one
   * appearing to the next. The visible time stacks on top, so these bracket
   * SOCIAL_PROOF_CYCLE_MS once visibleMs is added rather than being the
   * interval themselves. Getting this backwards is what made a "15s" setting
   * read as 25s on the page.
   */
  minGapMs: 8_000,
  maxGapMs: 12_000,
}

/** Appearance to appearance, which is the interval anyone would describe. */
export function cycleMs(gapMs: number): number {
  return SOCIAL_PROOF_TIMING.visibleMs + gapMs
}

/** A gap somewhere in the configured range, so the run never feels metronomic. */
export function nextGapMs(random: () => number = Math.random): number {
  const { minGapMs, maxGapMs } = SOCIAL_PROOF_TIMING
  return Math.round(minGapMs + random() * (maxGapMs - minGapMs))
}

/**
 * `offer.tag` reads "Matematik · Tingkatan 4 dan 5". A toast has room for the
 * subject and not the level, and taking it from the campaign is what makes the
 * SPM page's notices say something different from the primary page's.
 */
export function subjectFromOfferTag(tag: string): string {
  return (tag.split('·')[0] ?? '').trim()
}

export interface SignupNotice {
  title: string
  detail: string
  /** First letter of the parent's given name, for the avatar circle. */
  initial: string
}

/** One notice, in Malay, because everyone who reads it is a parent. */
export function noticeFor(signup: SiteSignup, subject: string): SignupNotice {
  const what = subject ? `Baru mendaftar ${subject}` : 'Baru mendaftar'
  // "Puan Aisyah" -> A. The honorific is not the initial anyone recognises.
  const given = signup.name.replace(/^(Puan|Encik|Cik|Tuan)\s+/i, '')
  return {
    title: `${signup.name} dari ${signup.area}`,
    detail: `${what} · ${signup.agoLabel}`,
    initial: (given[0] ?? signup.name[0] ?? '?').toUpperCase(),
  }
}

/**
 * Whether a notice is still owed. The run ends when the pool is spent rather
 * than wrapping: repeating the same names is the clearest tell that the
 * notices are staged.
 */
export function hasMore(pool: SiteSignup[], shown: number): boolean {
  return shown < pool.length
}
