import { describe, it, expect } from 'vitest'
import { useAttendance } from '~/composables/useAttendance'

describe('useAttendance', () => {
  it('defaults every student to present and counts live', () => {
    const a = useAttendance()
    a.reset()
    const roster = ['Ali', 'Siti', 'Tan']
    expect(a.counts('c0', roster)).toEqual({ present: 3, late: 0, absent: 0 })
    a.set('c0', 'Ali', 'absent')
    a.set('c0', 'Siti', 'late')
    expect(a.counts('c0', roster)).toEqual({ present: 1, late: 1, absent: 1 })
    expect(a.statusOf('c0', 'Ali')).toBe('absent')
    expect(a.statusOf('c0', 'Tan')).toBe('present')
  })

  it('reset clears all edits back to present', () => {
    const a = useAttendance()
    a.set('c1', 'Ali', 'absent')
    a.reset()
    expect(a.counts('c1', ['Ali', 'Siti'])).toEqual({ present: 2, late: 0, absent: 0 })
  })

  it('keys are scoped per class', () => {
    const a = useAttendance()
    a.reset()
    a.set('c0', 'Ali', 'late')
    expect(a.statusOf('c1', 'Ali')).toBe('present')
  })
})
