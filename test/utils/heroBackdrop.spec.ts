import { describe, expect, it } from 'vitest'
import {
  HERO_BACKDROP_SLOTS,
  HERO_CONTAINER_WIDTH,
  buildHeroBackdrop,
  isClearOfContent,
  slotLeft,
} from '~/utils/heroBackdrop'
import { fluentIconExists, stripFluentPrefix } from '../helpers/fluentIcons'
import { useAcademyStore } from '~/stores/academy'
import type { Subject } from '~/types'

// The hero backdrop is decoration behind live copy. Two things can go wrong
// silently: an icon drifts over the headline, or a mistyped icon name renders
// an empty box that nobody notices on a page a buyer is looking at.

const subjects = [
  { name: 'Matematik', fluentIcon: 'i-fluent-calculator-24-regular' },
  { name: 'Sains', fluentIcon: 'i-fluent-beaker-24-regular' },
  { name: 'Geografi', fluentIcon: 'i-fluent-globe-24-regular' },
] as Subject[]

describe('isClearOfContent', () => {
  it('rejects an icon whose half-width reaches past the container edge', () => {
    expect(isClearOfContent({ offset: 20, size: 78 })).toBe(false)
  })

  it('accepts an icon that fits between its centre and the edge', () => {
    expect(isClearOfContent({ offset: 54, size: 78 })).toBe(true)
  })

  it('accepts an icon sitting exactly against the edge', () => {
    expect(isClearOfContent({ offset: 39, size: 78 })).toBe(true)
  })
})

describe('slotLeft', () => {
  it('anchors a left slot outside the container edge', () => {
    expect(slotLeft({ anchor: 'left', offset: 54 })).toBe(
      `calc(50% - ${HERO_CONTAINER_WIDTH / 2 + 54}px)`,
    )
  })

  it('anchors a right slot outside the far edge', () => {
    expect(slotLeft({ anchor: 'right', offset: 36 })).toBe(
      `calc(50% + ${HERO_CONTAINER_WIDTH / 2 + 36}px)`,
    )
  })

  // The regression this whole anchoring scheme exists for: a percentage that
  // cleared the headline at 1920 sat on top of it at 1440.
  it.each([1280, 1440, 1680, 1920, 2560])(
    'keeps every icon out of the content column at %ipx wide',
    (viewport) => {
      const containerLeft = Math.max(0, (viewport - HERO_CONTAINER_WIDTH) / 2)
      const containerRight = viewport - containerLeft
      for (const slot of HERO_BACKDROP_SLOTS) {
        const centre = slot.anchor === 'left'
          ? viewport / 2 - HERO_CONTAINER_WIDTH / 2 - slot.offset
          : viewport / 2 + HERO_CONTAINER_WIDTH / 2 + slot.offset
        if (slot.anchor === 'left') expect(centre + slot.size / 2).toBeLessThanOrEqual(containerLeft)
        else expect(centre - slot.size / 2).toBeGreaterThanOrEqual(containerRight)
      }
    },
  )
})

describe('hero backdrop slots', () => {
  it('places enough icons to read as a field, not as a stray mark', () => {
    expect(HERO_BACKDROP_SLOTS.length).toBeGreaterThanOrEqual(8)
  })

  it('balances the field across both margins', () => {
    const left = HERO_BACKDROP_SLOTS.filter((s) => s.anchor === 'left').length
    expect(left).toBe(HERO_BACKDROP_SLOTS.length - left)
  })

  it.each(HERO_BACKDROP_SLOTS.map((s, i) => [i, s] as const))(
    'slot %i stays clear of the headline and the timetable card',
    (_i, slot) => {
      expect(isClearOfContent(slot)).toBe(true)
    },
  )

  it('keeps every icon faint enough to stay behind the copy', () => {
    for (const slot of HERO_BACKDROP_SLOTS) {
      expect(slot.opacity).toBeGreaterThan(0)
      expect(slot.opacity).toBeLessThanOrEqual(0.09)
    }
  })

  // Identical cycles would make the whole field pulse in unison, which reads as
  // a broken loop rather than as drift.
  it('gives every icon its own drift cycle', () => {
    const durations = HERO_BACKDROP_SLOTS.map((s) => s.duration)
    expect(new Set(durations).size).toBe(durations.length)
    for (const d of durations) expect(d).toBeGreaterThanOrEqual(20)
  })
})

describe('buildHeroBackdrop', () => {
  const built = buildHeroBackdrop(subjects)

  it('fills every slot, cycling subjects when there are fewer than slots', () => {
    expect(built).toHaveLength(HERO_BACKDROP_SLOTS.length)
  })

  it('draws every icon from the subject data, never a literal', () => {
    const known = subjects.map((s) => s.fluentIcon)
    for (const icon of built) expect(known).toContain(icon.icon)
  })

  it('never repeats an icon back to back', () => {
    for (let i = 1; i < built.length; i++) {
      expect(built[i]!.icon).not.toBe(built[i - 1]!.icon)
    }
  })

  it('returns nothing rather than throwing when there are no subjects', () => {
    expect(buildHeroBackdrop([])).toEqual([])
  })

  // Guards the real seed, not the fixture above: a renamed subject icon in the
  // store must not leave the hero rendering empty boxes.
  it('every real subject icon it can draw exists in the Fluent set', () => {
    const real = useAcademyStore().subjects as Subject[]
    for (const icon of buildHeroBackdrop(real)) {
      expect(fluentIconExists(stripFluentPrefix(icon.icon))).toBe(true)
    }
  })
})
