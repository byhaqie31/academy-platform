import { useClasses } from '~/composables/useClasses'
import { useSubjects } from '~/composables/useSubjects'
import { useAcademy } from '~/composables/useAcademy'
import { useHostPool } from '~/composables/useHostPool'
import type { Class, Day, SubjectTone } from '~/types'

export type SessionState = 'running' | 'starting' | 'scheduled' | 'empty'

export interface TonightRow {
  cls: Class
  tutor: string
  branch: string
  tone: SubjectTone
  host: string
  expected: number
  joined: number
  unknown: number
  state: SessionState
  /** the alert an operator has to act on, if any */
  alert: string | null
}

export interface TonightView {
  day: Day
  rows: TonightRow[]
  slots: string[]
  forSlot: (time: string) => TonightRow[]
  totals: {
    classes: number
    expected: number
    joined: number
    unknown: number
    alerts: number
    licences: number
    peakUsed: number
  }
}

/**
 * The screen an operator has open from 7:30pm.
 *
 * The four alerts are the reason it exists: a class with no tutor, a class with
 * no licence, a room still empty five minutes in, and a participant who is not
 * on the paid roster.
 */
// swap internals for API calls when backend lands; signature stays stable
export function useTonight() {
  const classes = useClasses()
  const subjects = useSubjects()
  const { branchShort } = useAcademy()
  const pool = useHostPool()

  function forDay(day: Day): TonightView {
    const rows: TonightRow[] = classes.all
      .filter((c) => c.day === day)
      .sort((a, b) => a.time.localeCompare(b.time))
      .map((c, i) => {
        const expected = c.roster.length || 6 + (i % 5)
        // deterministic demo signal, standing in for participant_joined webhooks
        const joined = i === 1 ? 0 : Math.max(0, expected - (i % 3))
        const unknown = i === 0 ? 2 : i === 3 ? 1 : 0
        const state: SessionState =
          i === 1 ? 'empty' : i < 2 ? 'running' : i < 4 ? 'starting' : 'scheduled'

        const alert
          = state === 'empty'
            ? 'Room empty 5 min in'
            : unknown > 0
              ? `${unknown} unknown participant${unknown > 1 ? 's' : ''}`
              : null

        return {
          cls: c,
          tutor: subjects.tutorFor(c.subject) || 'Unassigned',
          branch: branchShort(c.branchId),
          tone: subjects.toneOf(c.subject) as SubjectTone,
          host: pool.hostFor(c.id),
          expected,
          joined,
          unknown,
          state,
          alert,
        }
      })

    const slots = [...new Set(rows.map((r) => r.cls.time))]

    return {
      day,
      rows,
      slots,
      forSlot: (time: string) => rows.filter((r) => r.cls.time === time),
      totals: {
        classes: rows.length,
        expected: rows.reduce((n, r) => n + r.expected, 0),
        joined: rows.reduce((n, r) => n + r.joined, 0),
        unknown: rows.reduce((n, r) => n + r.unknown, 0),
        alerts: rows.filter((r) => r.alert).length,
        licences: pool.size,
        peakUsed: Math.max(0, ...slots.map((t) => pool.usedIn(day, t))),
      },
    }
  }

  return { forDay }
}
