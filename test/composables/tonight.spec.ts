import { describe, it, expect } from 'vitest'
import { useTonight } from '~/composables/useTonight'
import { useClasses } from '~/composables/useClasses'

// The dashboard strip has to land on a day that actually has classes, or the
// first thing in the meeting is an empty box.
describe('useTonight day selection', () => {
  it('stays on the given day when that day teaches', () => {
    const tonight = useTonight()
    const taught = useClasses().all[0]!.day
    expect(tonight.teachingDayFrom(taught)).toBe(taught)
  })

  it('rolls forward to the next teaching day when the given day is empty', () => {
    const tonight = useTonight()
    const classes = useClasses()
    const idle = (['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const).find(
      (d) => !classes.all.some((c) => c.day === d),
    )!

    const landed = tonight.teachingDayFrom(idle)

    expect(landed).not.toBe(idle)
    expect(classes.all.some((c) => c.day === landed)).toBe(true)
  })

  it('always lands somewhere with rows to show', () => {
    const tonight = useTonight()
    for (const day of ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const) {
      expect(tonight.forDay(tonight.teachingDayFrom(day)).rows.length).toBeGreaterThan(0)
    }
  })
})
