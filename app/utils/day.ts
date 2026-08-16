import type { Day } from '~/types'

const MS: Record<Day, string> = {
  Mon: 'Isnin',
  Tue: 'Selasa',
  Wed: 'Rabu',
  Thu: 'Khamis',
  Fri: 'Jumaat',
  Sat: 'Sabtu',
  Sun: 'Ahad',
}

/** Malay weekday, for parent-facing surfaces. */
export function dayMs(day: Day): string {
  return MS[day] ?? day
}
