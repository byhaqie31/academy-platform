import { useAcademyStore } from '~/stores/academy'

// swap internals for API calls when backend lands; signature stays stable
export function useAcademy() {
  const store = useAcademyStore()
  return {
    academy: store.academy,
    branches: store.branches,
    branchById: (id: string) => store.branches.find((b) => b.id === id),
    branchShort: (id: string) => store.branches.find((b) => b.id === id)?.short ?? id,
  }
}
