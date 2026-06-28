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
