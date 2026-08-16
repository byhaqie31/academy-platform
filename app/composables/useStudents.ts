import { useAcademyStore } from '~/stores/academy'
import type { Student } from '~/types'

export interface StudentFilter {
  q?: string
  level?: string
  subject?: string
  pay?: string
}

// swap internals for API calls when backend lands; signature stays stable
export function useStudents() {
  const store = useAcademyStore()
  // Seeded roll plus anyone registered during the walkthrough.
  const all = (): Student[] => [...(store.students as Student[]), ...store.demo.registeredStudents]
  return {
    get all() {
      return all()
    },
    byId: (id: string) => all().find((s) => s.id === id),
    indexOf: (id: string) => all().findIndex((s) => s.id === id),
    filter: (f: StudentFilter): Student[] =>
      all().filter((s) => {
        if (f.q && !s.name.toLowerCase().includes(f.q.toLowerCase())) return false
        if (f.level && s.level !== f.level) return false
        if (f.subject && !s.subjects.includes(f.subject)) return false
        if (f.pay && s.pay !== f.pay) return false
        return true
      }),
  }
}
