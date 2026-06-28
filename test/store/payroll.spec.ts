import { describe, it, expect } from 'vitest'
import { useAcademyStore } from '~/stores/academy'

describe('seeded payroll consistency', () => {
  it('Cikgu Hafiz has 38 recorded hours at RM45 = RM1710', () => {
    const s = useAcademyStore()
    const hafiz = s.educators.find((e) => e.id === s.tutorSelfId)!
    const hours = s.sessions
      .filter((x) => x.educatorId === hafiz.id)
      .reduce((t, x) => t + x.durationHours, 0)
    expect(hours).toBe(38)
    expect(hafiz.rate).toBe(45)
    expect(hours * hafiz.rate).toBe(1710)
  })

  it('every educator has sessions summing exactly to their recorded hours', () => {
    const s = useAcademyStore()
    for (const e of s.educators) {
      const hours = s.sessions
        .filter((x) => x.educatorId === e.id)
        .reduce((t, x) => t + x.durationHours, 0)
      expect(hours).toBe(e.hours)
    }
  })

  it('total recorded hours across educators is 170j', () => {
    const s = useAcademyStore()
    const total = s.sessions.reduce((t, x) => t + x.durationHours, 0)
    expect(total).toBe(170)
  })

  it('every class references an existing educator and branch', () => {
    const s = useAcademyStore()
    for (const c of s.classes) {
      expect(s.educators.some((e) => e.id === c.educatorId)).toBe(true)
      expect(academyHasBranch(s, c.branchId)).toBe(true)
    }
  })

  it('every student references an existing guardian and branch', () => {
    const s = useAcademyStore()
    for (const st of s.students) {
      expect(s.guardians.some((g) => g.id === st.guardianId)).toBe(true)
      expect(academyHasBranch(s, st.branchId)).toBe(true)
    }
  })
})

function academyHasBranch(s: ReturnType<typeof useAcademyStore>, id: string) {
  return s.branches.some((b) => b.id === id)
}
