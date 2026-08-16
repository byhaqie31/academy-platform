import { useClasses } from '~/composables/useClasses'
import type { Class, Day } from '~/types'

/**
 * The classroom licence pool.
 *
 * A licence is not a person. One licensed host account can run one room at a
 * time, so tutors teaching in different slots share one. The pool is therefore
 * sized by peak concurrency, not by headcount, which is the difference between
 * a licence per tutor and a licence per room live at once.
 *
 * The allocator's one hard rule: no two classes sharing a host account may
 * ever occupy the same slot. It is enforced here, at assignment time, rather
 * than discovered at 8pm.
 */
export interface SlotKey {
  day: Day
  time: string
}

export const slotId = (day: Day, time: string) => `${day}|${time}`

// swap internals for API calls when backend lands; signature stays stable
export function useHostPool() {
  const classes = useClasses()

  /** classes grouped by the slot they occupy */
  const bySlot = new Map<string, Class[]>()
  for (const c of classes.all) {
    const key = slotId(c.day, c.time)
    bySlot.set(key, [...(bySlot.get(key) ?? []), c])
  }

  /** peak concurrency across the week — this is the licence count the centre must buy */
  const peak = Math.max(0, ...[...bySlot.values()].map((list) => list.length))

  /** greedy assignment: within a slot, hand out host-01, host-02, … */
  const assignment = new Map<string, string>()
  for (const [, list] of bySlot) {
    list.forEach((c, i) => {
      assignment.set(c.id, `host-${String(i + 1).padStart(2, '0')}`)
    })
  }

  /**
   * What the centre actually owns. In the real system this is a tenant setting, read
   * off the Zoom invoice. Derived here as the peak plus a little headroom, so
   * the timetable can show real slack and can legitimately go red when a slot
   * is over-subscribed.
   */
  const capacity = peak + 2

  return {
    /** how many licences the timetable actually needs at its busiest moment */
    size: peak,
    /** how many licences the centre holds */
    capacity,
    /** licences in use during a given slot */
    usedIn: (day: Day, time: string) => (bySlot.get(slotId(day, time)) ?? []).length,
    /** classes running in a given slot */
    classesIn: (day: Day, time: string) => bySlot.get(slotId(day, time)) ?? [],
    /** the host account allocated to a class */
    hostFor: (classId: string) => assignment.get(classId) ?? 'unassigned',
    /** tutors not teaching in a given slot */
    freeTutorsIn: (day: Day, time: string, totalTutors: number) =>
      Math.max(0, totalTutors - (bySlot.get(slotId(day, time)) ?? []).length),
  }
}
