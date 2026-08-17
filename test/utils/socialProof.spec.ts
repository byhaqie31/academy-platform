import { describe, expect, it } from 'vitest'
import {
  SOCIAL_PROOF_TIMING,
  hasMore,
  nextGapMs,
  noticeFor,
  subjectFromOfferTag,
} from '~/utils/socialProof'
import type { SiteSignup } from '~/types'

const signup: SiteSignup = {
  id: 'aisyah',
  name: 'Puan Aisyah',
  area: 'Kajang',
  agoLabel: '4 minit lalu',
}

describe('subjectFromOfferTag', () => {
  // offer.tag reads "Matematik · Tingkatan 4 dan 5". A toast has room for the
  // subject, not the whole tag.
  it('takes the subject ahead of the separator', () => {
    expect(subjectFromOfferTag('Matematik · Tingkatan 4 dan 5')).toBe('Matematik')
  })

  it('trims a tag that is already just a subject', () => {
    expect(subjectFromOfferTag('  Sains  ')).toBe('Sains')
  })

  it('survives an empty tag rather than rendering a stray separator', () => {
    expect(subjectFromOfferTag('')).toBe('')
  })
})

describe('noticeFor', () => {
  const notice = noticeFor(signup, 'Matematik')

  it('names the parent and where they are', () => {
    expect(notice.title).toBe('Puan Aisyah dari Kajang')
  })

  it('says what they registered for and when', () => {
    expect(notice.detail).toBe('Baru mendaftar Matematik · 4 minit lalu')
  })

  it('drops the subject cleanly when a campaign has no tag', () => {
    expect(noticeFor(signup, '').detail).toBe('Baru mendaftar · 4 minit lalu')
  })

  it('carries the initial for the avatar circle', () => {
    expect(notice.initial).toBe('A')
  })
})

describe('nextGapMs', () => {
  it('returns the low bound when the roll is 0', () => {
    expect(nextGapMs(() => 0)).toBe(SOCIAL_PROOF_TIMING.minGapMs)
  })

  it('stays inside the configured bounds across the range', () => {
    for (const roll of [0, 0.25, 0.5, 0.75, 0.999]) {
      const gap = nextGapMs(() => roll)
      expect(gap).toBeGreaterThanOrEqual(SOCIAL_PROOF_TIMING.minGapMs)
      expect(gap).toBeLessThanOrEqual(SOCIAL_PROOF_TIMING.maxGapMs)
    }
  })

  it('opens sooner than it repeats, so a short visit still sees one', () => {
    expect(SOCIAL_PROOF_TIMING.firstDelayMs).toBeLessThan(SOCIAL_PROOF_TIMING.minGapMs)
  })

  it('clears each toast well before the next is due', () => {
    expect(SOCIAL_PROOF_TIMING.visibleMs).toBeLessThan(SOCIAL_PROOF_TIMING.minGapMs)
  })
})

describe('hasMore', () => {
  const pool = [signup, signup, signup]

  it('is true while the pool has an unshown entry', () => {
    expect(hasMore(pool, 0)).toBe(true)
    expect(hasMore(pool, 2)).toBe(true)
  })

  // A loop that repeats the same names is the clearest tell that the notices
  // are staged, so the run ends rather than wrapping.
  it('is false once the pool is spent, and never wraps', () => {
    expect(hasMore(pool, 3)).toBe(false)
    expect(hasMore(pool, 99)).toBe(false)
  })

  it('is false for an empty pool', () => {
    expect(hasMore([], 0)).toBe(false)
  })
})
