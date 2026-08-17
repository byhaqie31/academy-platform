import type { Subject } from '~/types'

// The drifting icon field behind the marketing hero.
//
// Positions are hand-placed, never random. Random placement eventually drops a
// calculator over the headline, and it does so on someone else's screen size
// rather than on the one you were looking at when you wrote it.

/** Matches the hero container's `max-width: 1120px`. */
export const HERO_CONTAINER_WIDTH = 1120

export interface HeroBackdropSlot {
  /** Which side of the content column this icon sits outside of. */
  anchor: 'left' | 'right'
  /**
   * Distance in px from the container edge out to the icon's centre. Positions
   * are anchored to the container rather than expressed as a percentage of the
   * section, because the container is centred at a fixed max width: the share
   * of the viewport it occupies changes with the window, so a percentage that
   * clears the headline at 1920 sits on top of it at 1440.
   */
  offset: number
  /** Vertical position as a percentage of the hero's height. */
  topPct: number
  /** Rendered icon size in px. */
  size: number
  opacity: number
  /** Seconds for one full out-and-back drift. */
  duration: number
  /** Travel at the far end of the drift. */
  driftX: number
  driftY: number
  rotate: number
}

export interface HeroBackdropIcon extends HeroBackdropSlot {
  /** A Fluent icon name taken from the subject seed. */
  icon: string
  /** CSS `left` anchoring the icon's centre to the container edge. */
  left: string
}

/**
 * Half the icon's width has to fit between its centre and the container edge,
 * or the icon laps over the content. Since both the centre and the edge are
 * anchored to the same point, this one comparison holds at every viewport
 * width: below the container's max width the whole field slides off-screen and
 * is clipped, which is the correct behaviour rather than a failure.
 */
export function isClearOfContent(slot: Pick<HeroBackdropSlot, 'offset' | 'size'>): boolean {
  return slot.offset >= slot.size / 2
}

/** `left` for a slot, as a calc() against the centred container's edge. */
export function slotLeft(slot: Pick<HeroBackdropSlot, 'anchor' | 'offset'>): string {
  const half = HERO_CONTAINER_WIDTH / 2
  return slot.anchor === 'left'
    ? `calc(50% - ${half + slot.offset}px)`
    : `calc(50% + ${half + slot.offset}px)`
}

/**
 * Eight slots, four down each margin. Durations are all different on purpose,
 * so the field never falls into step and pulses as one thing.
 */
export const HERO_BACKDROP_SLOTS: HeroBackdropSlot[] = [
  { anchor: 'left', offset: 54, topPct: 15, size: 78, opacity: 0.075, duration: 27, driftX: 14, driftY: -20, rotate: 7 },
  { anchor: 'left', offset: 32, topPct: 47, size: 52, opacity: 0.06, duration: 34, driftX: -12, driftY: 18, rotate: -6 },
  { anchor: 'left', offset: 44, topPct: 76, size: 64, opacity: 0.07, duration: 23, driftX: 18, driftY: 14, rotate: 5 },
  { anchor: 'left', offset: 26, topPct: 96, size: 44, opacity: 0.055, duration: 31, driftX: -10, driftY: -16, rotate: -9 },
  { anchor: 'right', offset: 36, topPct: 11, size: 58, opacity: 0.065, duration: 25, driftX: -16, driftY: 20, rotate: -5 },
  { anchor: 'right', offset: 50, topPct: 42, size: 72, opacity: 0.08, duration: 37, driftX: 12, driftY: -14, rotate: 8 },
  { anchor: 'right', offset: 28, topPct: 82, size: 48, opacity: 0.06, duration: 21, driftX: -14, driftY: -18, rotate: 6 },
  { anchor: 'right', offset: 34, topPct: 96, size: 56, opacity: 0.07, duration: 29, driftX: 16, driftY: 12, rotate: -7 },
]

/**
 * Pairs the slots with subject icons from the seed, cycling when there are
 * fewer subjects than slots. The icons come from the data rather than a literal
 * list here, so a centre that teaches different subjects gets a hero that
 * follows without anyone editing this file.
 */
export function buildHeroBackdrop(subjects: Subject[]): HeroBackdropIcon[] {
  const pool = subjects.map((s) => s.fluentIcon).filter(Boolean)
  if (!pool.length) return []

  // Plain modulo: consecutive slots always land on different icons for any pool
  // of more than one, which is the only adjacency that matters here.
  return HERO_BACKDROP_SLOTS.map((slot, i) => ({
    ...slot,
    icon: pool[i % pool.length]!,
    left: slotLeft(slot),
  }))
}
