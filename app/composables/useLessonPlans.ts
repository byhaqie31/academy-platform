import { useAcademyStore } from '~/stores/academy'

// swap internals for API calls when backend lands; signature stays stable
export function useLessonPlans() {
  const store = useAcademyStore()
  const all = store.lessonPlans
  const classIdsFor = (educatorId: string) =>
    store.classes.filter((c) => c.educatorId === educatorId).map((c) => c.id)
  return {
    all,
    forClass: (classId: string) => all.filter((p) => p.classId === classId),
    forEducator: (educatorId: string) => {
      const ids = classIdsFor(educatorId)
      return all.filter((p) => ids.includes(p.classId))
    },
  }
}
