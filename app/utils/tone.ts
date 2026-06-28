import type { SubjectTone } from '~/types'

// The 8 tile colour pairings. Avatars rotate through the first 6 by index.
export const TONES: SubjectTone[] = [
  'pink',
  'blue',
  'violet',
  'green',
  'amber',
  'orange',
  'indigo',
  'rose',
]

/** Background tile colour for a tone, as a CSS var usable in :style. */
export function toneTile(tone: SubjectTone): string {
  return `var(--color-tile-${tone})`
}

/** Foreground (text/icon) colour for a tone, as a CSS var usable in :style. */
export function toneFg(tone: SubjectTone): string {
  return `var(--color-fg-${tone})`
}

/** Paired tile + fg style object for icon tiles and chips. */
export function tonePair(tone: SubjectTone): { background: string; color: string } {
  return { background: toneTile(tone), color: toneFg(tone) }
}

/** Cycle the avatar palette by index, i % 6. */
export function toneByIndex(i: number): SubjectTone {
  return TONES[i % 6]!
}
