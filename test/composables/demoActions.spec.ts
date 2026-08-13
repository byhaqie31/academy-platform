import { describe, it, expect } from 'vitest'
import { useDemoActions } from '~/composables/useDemoActions'
import { useAdminMetrics } from '~/composables/useAdminMetrics'
import { useBilling } from '~/composables/useBilling'
import { useCollection } from '~/composables/useCollection'
import { useStudents } from '~/composables/useStudents'

const firstUnpaid = () => useBilling().all.find((i) => i.status !== 'Paid')!

describe('useDemoActions', () => {
  it('recording a payment reduces outstanding by the invoice amount', () => {
    const actions = useDemoActions()
    const metrics = useAdminMetrics()
    const billing = useBilling()

    const unpaid = billing.all.find((i) => i.status !== 'Paid')!
    const before = metrics.outstanding

    actions.recordPayment(unpaid.id)

    expect(metrics.outstanding).toBe(before - unpaid.amount)
  })

  it('recording the same payment twice only counts once', () => {
    const actions = useDemoActions()
    const metrics = useAdminMetrics()
    const unpaid = firstUnpaid()
    const before = metrics.outstanding

    actions.recordPayment(unpaid.id)
    actions.recordPayment(unpaid.id)

    expect(metrics.outstanding).toBe(before - unpaid.amount)
  })

  it('recording a payment drops the outstanding student count', () => {
    const actions = useDemoActions()
    const metrics = useAdminMetrics()
    const before = metrics.outstandingCount

    actions.recordPayment(firstUnpaid().id)

    expect(metrics.outstandingCount).toBe(before - 1)
  })

  it('reset restores the seeded outstanding figure', () => {
    const actions = useDemoActions()
    const metrics = useAdminMetrics()
    const seeded = metrics.outstanding

    actions.recordPayment(firstUnpaid().id)
    actions.reset()

    expect(metrics.outstanding).toBe(seeded)
  })

  it('a settled invoice reads as paid with proof on billing', () => {
    const actions = useDemoActions()
    const billing = useBilling()
    const unpaid = firstUnpaid()

    actions.recordPayment(unpaid.id)

    const after = billing.all.find((i) => i.id === unpaid.id)!
    expect(after.status).toBe('Paid')
    expect(after.proof).toBe(true)
  })

  it('leaves the seeded invoice untouched so reset is a clean revert', () => {
    const actions = useDemoActions()
    const unpaid = firstUnpaid()
    const seededStatus = unpaid.status

    actions.recordPayment(unpaid.id)
    actions.reset()

    expect(useBilling().all.find((i) => i.id === unpaid.id)!.status).toBe(seededStatus)
  })

  it('chasing a family stamps it as chased today and leaves the rest alone', () => {
    const actions = useDemoActions()
    const collection = useCollection()
    const target = collection.unpaid[0]!
    const untouched = collection.unpaid.find((r) => r.guardianId !== target.guardianId)!
    const untouchedBefore = untouched.lastReminder

    actions.chase([target.guardianId])

    const after = collection.rows.find((r) => r.guardianId === target.guardianId)!
    expect(after.lastReminder).toBe('Just now')
    expect(collection.rows.find((r) => r.guardianId === untouched.guardianId)!.lastReminder)
      .toBe(untouchedBefore)
  })

  it('registering a student adds them to the roll and raises the active count', () => {
    const actions = useDemoActions()
    const metrics = useAdminMetrics()
    const students = useStudents()
    const countBefore = students.all.length
    const activeBefore = metrics.activeStudents

    actions.registerStudent({ name: 'Nurul Izzah', level: 'Tahun 5', subjects: ['Matematik'] })

    expect(students.all.length).toBe(countBefore + 1)
    expect(students.all.some((s) => s.name === 'Nurul Izzah')).toBe(true)
    expect(metrics.activeStudents).toBe(activeBefore + 1)
  })

  it('reset clears chased families and registered students', () => {
    const actions = useDemoActions()
    const collection = useCollection()
    const students = useStudents()
    const seededCount = students.all.length

    actions.chase([collection.unpaid[0]!.guardianId])
    actions.registerStudent({ name: 'Nurul Izzah', level: 'Tahun 5', subjects: ['Matematik'] })
    actions.reset()

    expect(students.all.length).toBe(seededCount)
    expect(collection.rows.every((r) => r.lastReminder !== 'Just now')).toBe(true)
  })

  it('reports whether the walkthrough has anything to reset', () => {
    const actions = useDemoActions()
    expect(actions.hasEdits).toBe(false)

    actions.recordPayment(firstUnpaid().id)
    expect(actions.hasEdits).toBe(true)

    actions.reset()
    expect(actions.hasEdits).toBe(false)
  })

  it('collection rows reflect an invoice settled after the rows were read', () => {
    const actions = useDemoActions()
    const collection = useCollection()
    const unpaid = firstUnpaid()
    const unpaidBefore = collection.unpaid.length

    actions.recordPayment(unpaid.id)

    expect(collection.unpaid.length).toBe(unpaidBefore - 1)
  })
})
