import { describe, it, expect } from 'vitest'
import { adminNav } from '~/composables/usePortalNav'
import { useCollection } from '~/composables/useCollection'
import { useAcademyStore } from '~/stores/academy'

// Hz Academy runs fully online, so branches are not part of the admin story.
// They stay in the seed and on the marketing site; admin simply stops showing
// them.
describe('admin portal after going fully online', () => {
  it('has no branches destination in the nav', () => {
    expect(adminNav.some((item) => item.to === '/admin/branches')).toBe(false)
  })

  it('has no branches entry in the demo directory notes', () => {
    expect(useAcademyStore().demoNotes['/admin/branches']).toBeUndefined()
  })

  it('does not put a branch on a collection row', () => {
    const row = useCollection().rows[0]!
    expect(row).not.toHaveProperty('branch')
  })

  it('keeps branches in the seed, because marketing still uses them', () => {
    const store = useAcademyStore()
    expect(store.branches.length).toBeGreaterThan(0)
    expect(store.students.every((s) => s.branchId)).toBe(true)
  })
})
