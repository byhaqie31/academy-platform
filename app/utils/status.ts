import type { AttendanceStatus, EnrolStatus, EnquiryStatus, PayStatus } from '~/types'

// Pill tones extend the subject tones with two status-only pairs.
export type PillTone =
  | 'pink' | 'blue' | 'violet' | 'green' | 'amber' | 'orange' | 'indigo' | 'rose'
  | 'overdue' | 'inactive'

export function payTone(s: PayStatus): PillTone {
  return s === 'Paid' ? 'green' : s === 'Pending' ? 'amber' : 'overdue'
}

export function enrolTone(s: EnrolStatus): PillTone {
  return s === 'Active' ? 'green' : s === 'Trial' ? 'amber' : 'inactive'
}

export function attTone(s: AttendanceStatus): PillTone {
  return s === 'present' ? 'green' : s === 'late' ? 'amber' : 'overdue'
}

/**
 * Attendance reads as a health figure, not a status, so it is coloured on a
 * threshold rather than a pill. Below 80 is the number an admin should act on.
 */
export function attendanceTone(pct: number): PillTone {
  return pct >= 90 ? 'green' : pct >= 80 ? 'amber' : 'overdue'
}

export function enquiryTone(s: EnquiryStatus): PillTone {
  return s === 'new' ? 'blue' : s === 'pending' ? 'amber' : 'inactive'
}

export function sourceTone(source: string): PillTone {
  return source === 'Facebook' ? 'blue' : source === 'TikTok' ? 'violet' : 'green'
}

export function sourceIcon(source: string): string {
  return source === 'Facebook'
    ? 'i-fluent-megaphone-20-regular'
    : source === 'TikTok'
      ? 'i-fluent-music-note-2-20-regular'
      : 'i-fluent-search-20-regular'
}

/** Inline style for any pill / tile from a tone key. */
export function pillStyle(tone: PillTone): { background: string; color: string } {
  return { background: `var(--color-tile-${tone})`, color: `var(--color-fg-${tone})` }
}
