import { useAcademyStore } from '~/stores/academy'
import type { Class } from '~/types'

// swap internals for API calls when backend lands; signature stays stable
export function useClasses() {
  const store = useAcademyStore()
  const all = store.classes as Class[]
  return {
    all,
    byId: (id: string) => all.find((c) => c.id === id),
    forEducator: (educatorId: string) => all.filter((c) => c.educatorId === educatorId),
    forBranch: (branchId: string) => all.filter((c) => c.branchId === branchId),
  }
}
