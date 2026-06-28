import { storeToRefs } from 'pinia'
import { useAcademyStore } from '~/stores/academy'
import type { AttendanceStatus } from '~/types'

// The one genuinely mutable surface in the mockup: the tutor marks a roster
// and the summary recomputes live. Default status for every student is present.
// swap internals for API calls when backend lands; signature stays stable
export function useAttendance() {
  const store = useAcademyStore()
  const { attendance } = storeToRefs(store)

  const key = (classId: string, student: string) => `${classId}|${student}`

  const statusOf = (classId: string, student: string): AttendanceStatus =>
    attendance.value[key(classId, student)] ?? 'present'

  const set = (classId: string, student: string, status: AttendanceStatus) =>
    store.setAttendance(key(classId, student), status)

  const counts = (classId: string, roster: string[]) => {
    let present = 0
    let late = 0
    let absent = 0
    for (const name of roster) {
      const s = statusOf(classId, name)
      if (s === 'present') present++
      else if (s === 'late') late++
      else absent++
    }
    return { present, late, absent }
  }

  return { state: attendance, statusOf, set, counts, reset: () => store.resetAttendance() }
}
