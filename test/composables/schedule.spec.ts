import { describe, it, expect } from 'vitest'
import { useSchedule } from '~/composables/useSchedule'
import { useAcademyStore } from '~/stores/academy'

describe('useSchedule day values', () => {
  it('exposes English weekday columns, Monday first', () => {
    const { days } = useSchedule()
    expect(days).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
  })

  it('every seeded class sits on a day the grid actually renders', () => {
    const store = useAcademyStore()
    const { days } = useSchedule()
    const orphans = store.classes.filter((c) => !days.includes(c.day))
    expect(orphans).toEqual([])
  })

  it('grid() resolves at least one class into a cell', () => {
    const { grid } = useSchedule()
    const cells = grid().flatMap((row) => row.cells).filter(Boolean)
    expect(cells.length).toBeGreaterThan(0)
  })

  it('at least one class falls on Monday, so the tutor dashboard is non-empty', () => {
    const store = useAcademyStore()
    expect(store.classes.some((c) => c.day === 'Mon')).toBe(true)
  })

  it('ampm labels are English', () => {
    const store = useAcademyStore()
    const values = new Set(store.classes.map((c) => c.ampm))
    expect([...values].sort()).toEqual(['AFTERNOON', 'EVENING'])
  })
})
