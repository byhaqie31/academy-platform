import { describe, it, expect } from 'vitest'
import { demoStepTarget } from '~/composables/useDemoStepSelect'

const HOME = '/portal/parent'
const SUSPENDED = '/portal/parent/suspended'

describe('demoStepTarget', () => {
  it('navigates to the suspended screen when the suspended step is picked', () => {
    expect(demoStepTarget('suspended', HOME)).toBe(SUSPENDED)
  })

  it('stays put when suspended is picked on the suspended screen', () => {
    expect(demoStepTarget('suspended', SUSPENDED)).toBeNull()
  })

  it('returns home when a non-suspended step is picked on the suspended screen', () => {
    expect(demoStepTarget('paid', SUSPENDED)).toBe(HOME)
    expect(demoStepTarget('due', SUSPENDED)).toBe(HOME)
    expect(demoStepTarget('grace', SUSPENDED)).toBe(HOME)
  })

  it('does not navigate for non-suspended steps on the home screen', () => {
    expect(demoStepTarget('paid', HOME)).toBeNull()
    expect(demoStepTarget('final', HOME)).toBeNull()
    expect(demoStepTarget('partial', HOME)).toBeNull()
  })
})
