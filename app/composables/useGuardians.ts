import { useAcademyStore } from '~/stores/academy'

// swap internals for API calls when backend lands; signature stays stable
export function useGuardians() {
  const store = useAcademyStore()
  return {
    all: store.guardians,
    byId: (id: string) => store.guardians.find((g) => g.id === id),
    forStudent: (studentId: string) =>
      store.guardians.find((g) => g.studentIds.includes(studentId)),
  }
}
