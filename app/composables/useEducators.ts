import { useAcademyStore } from '~/stores/academy'
import type { Educator, PublicEducator } from '~/types'

// swap internals for API calls when backend lands; signature stays stable
export function useEducators() {
  const store = useAcademyStore()
  const all = store.educators as Educator[]

  // Pay is derived from recorded sessions, never hand-entered.
  const estimatedPay = (id: string): number => {
    const e = all.find((x) => x.id === id)
    if (!e) return 0
    const hours = store.sessions
      .filter((s) => s.educatorId === id)
      .reduce((t, s) => t + s.durationHours, 0)
    return hours * e.rate
  }

  // Public tutor cards for the marketing website. Built field by field rather
  // than by spreading the Educator, so `rate` and `hours` cannot leak onto a
  // public page by someone later adding a field to the entity.
  const publicProfiles = (): PublicEducator[] =>
    all.map((e) => {
      const extra = store.educatorPublic[e.id]
      return {
        id: e.id,
        name: e.name,
        initial: e.first.charAt(0),
        subjects: e.subjects.join(' dan '),
        years: extra?.years ?? 0,
        bio: extra?.bio ?? '',
        tone: e.tone,
      }
    })

  return {
    all,
    publicProfiles,
    byId: (id: string) => all.find((e) => e.id === id),
    indexOf: (id: string) => all.findIndex((e) => e.id === id),
    estimatedPay,
    self: () => all.find((e) => e.id === store.tutorSelfId)!,
  }
}
