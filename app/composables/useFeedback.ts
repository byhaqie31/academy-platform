import { useAcademyStore } from '~/stores/academy'

// swap internals for API calls when backend lands; signature stays stable
export function useFeedback() {
  const store = useAcademyStore()
  return {
    all: store.feedback,
    forStudent: (studentId: string) => store.feedback.filter((f) => f.studentId === studentId),
    forClass: (classId: string) => store.feedback.filter((f) => f.classId === classId),
  }
}
