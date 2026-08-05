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

export function enquiryTone(s: EnquiryStatus): PillTone {
  return s === 'new' ? 'blue' : s === 'pending' ? 'amber' : 'inactive'
}

export function sourceTone(source: string): PillTone {
  return source === 'Facebook' ? 'blue' : source === 'TikTok' ? 'violet' : 'green'
}

export function sourceIcon(source: string): string {
  return source === 'Facebook' ? '📣' : source === 'TikTok' ? '🎵' : '🔍'
}

/** Inline style for any pill / tile from a tone key. */
export function pillStyle(tone: PillTone): { background: string; color: string } {
  return { background: `var(--color-tile-${tone})`, color: `var(--color-fg-${tone})` }
}
