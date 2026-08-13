import { describe, it, expect } from 'vitest'
import { useEducators } from '~/composables/useEducators'
import { usePayroll } from '~/composables/usePayroll'
import { useAcademyStore } from '~/stores/academy'

describe('payroll derivation', () => {
  it('estimatedPay equals payroll run equals 1710 for Hafiz', () => {
    const id = useAcademyStore().tutorSelfId
    const pay = useEducators().estimatedPay(id)
    const run = usePayroll().runFor(id, 'Jun 2026')
    expect(pay).toBe(1710)
    expect(run.amount).toBe(1710)
    expect(run.amount).toBe(pay)
  })

  it('Hafiz weekly breakdown is [9.5, 9.5, 9, 10] and sums to 38', () => {
    const weeks = usePayroll().weeklyBreakdown('hafiz')
    expect(weeks).toEqual([9.5, 9.5, 9, 10])
    expect(weeks.reduce((a, b) => a + b, 0)).toBe(38)
  })

  it('Hafiz hours by class are [9, 9, 8, 12], amounts sum to 1710', () => {
    const byClass = usePayroll().byClass('hafiz')
    expect(byClass.map((c) => c.hours)).toEqual([9, 9, 8, 12])
    expect(byClass.reduce((t, c) => t + c.amount, 0)).toBe(1710)
  })
})

describe('the payroll board the admin screen renders', () => {
  it('has one row per educator', () => {
    const board = usePayroll().board('Jun 2026')
    expect(board.rows).toHaveLength(useEducators().all.length)
  })

  it('pays every educator exactly what their own portal shows them', () => {
    const educators = useEducators()
    for (const row of usePayroll().board('Jun 2026').rows) {
      expect(row.amount).toBe(educators.estimatedPay(row.educatorId))
    }
  })

  it('totals to the centre-wide payroll figure', () => {
    const board = usePayroll().board('Jun 2026')
    const summed = board.rows.reduce((t, r) => t + r.amount, 0)
    expect(board.total).toBe(summed)
    expect(board.hours).toBe(170)
  })

  it('carries the name and rate each row needs, without a second lookup', () => {
    const row = usePayroll().board('Jun 2026').rows.find((r) => r.educatorId === 'hafiz')!
    expect(row.name).toBe('Cikgu Hafiz')
    expect(row.rate).toBe(45)
    expect(row.hours).toBe(38)
  })
})
