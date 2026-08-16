import { useAcademyStore } from '~/stores/academy'
import { useHostPool } from '~/composables/useHostPool'
import type { Class, Day, ScheduleCell, SubjectTone } from '~/types'

const DAYS: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const ADMIN_TIMES = ['3:00 PM', '4:30 PM', '6:00 PM', '7:30 PM']

function timeToMinutes(t: string): number {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return 0
  let h = Number(m[1])
  const min = Number(m[2])
  const pm = m[3]!.toUpperCase() === 'PM'
  if (pm && h !== 12) h += 12
  if (!pm && h === 12) h = 0
  return h * 60 + min
}

export interface ScheduleRow {
  time: string
  cells: (ScheduleCell | null)[]
}

export interface ScheduleOptions {
  educatorId?: string
  times?: string[]
}

// swap internals for API calls when backend lands; signature stays stable
export function useSchedule() {
  const store = useAcademyStore()

  const subjectTone = (name: string): SubjectTone =>
    store.subjects.find((s) => s.name === name)?.tone ?? 'violet'
  const tutorFirst = (educatorId: string) =>
    store.educators.find((e) => e.id === educatorId)?.first ?? ''
  const hosts = useHostPool()

  const toCell = (c: Class): ScheduleCell => ({
    classId: c.id,
    subject: c.subject,
    cls: c.cls,
    tutor: tutorFirst(c.educatorId),
    // An online centre locates a class by which licensed room it runs in.
    host: hosts.hostFor(c.id),
    tone: subjectTone(c.subject),
  })

  const grid = (opts: ScheduleOptions = {}): ScheduleRow[] => {
    const pool = opts.educatorId
      ? store.classes.filter((c) => c.educatorId === opts.educatorId)
      : store.classes
    const times =
      opts.times ??
      (opts.educatorId
        ? [...new Set(pool.map((c) => c.time))].sort((a, b) => timeToMinutes(a) - timeToMinutes(b))
        : ADMIN_TIMES)
    return times.map((time) => ({
      time,
      cells: DAYS.map((day) => {
        const c = pool.find((x) => x.day === day && x.time === time)
        return c ? toCell(c) : null
      }),
    }))
  }

  // Core subjects shown in the schedule legend.
  const subjectLegend = ['Matematik', 'Bahasa Melayu', 'Bahasa Inggeris', 'Sains', 'Sejarah', 'Geografi'].map(
    (name) => ({ name, tone: subjectTone(name) }),
  )

  // The dashboard "today" agenda, resolved to names + tone.
  const todayAgenda = () =>
    store.agenda.map((a) => ({
      ...a,
      tutor: store.educators.find((e) => e.id === a.educatorId)?.name ?? '',
      tone: subjectTone(a.subject),
    }))

  return { grid, days: DAYS, subjectLegend, todayAgenda, toCell }
}
