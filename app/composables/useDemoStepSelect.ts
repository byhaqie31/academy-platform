import { useRoute, useRouter } from 'vue-router'
import { usePortalDemo, type CycleState } from '~/composables/usePortalDemo'

const HOME_PATH = '/portal/parent'
const SUSPENDED_PATH = '/portal/parent/suspended'

/**
 * Where picking a demo step should take the walkthrough, if anywhere.
 *
 * The suspended step opens the recovery screen; leaving the suspended state
 * from that screen returns home. Everything else stays where it is.
 */
export function demoStepTarget(step: CycleState, currentPath: string): string | null {
  if (step === 'suspended') return currentPath === SUSPENDED_PATH ? null : SUSPENDED_PATH
  return currentPath === SUSPENDED_PATH ? HOME_PATH : null
}

/** Demo-only: apply a cycle step and walk the demo to the matching screen. */
export function useDemoStepSelect() {
  const demo = usePortalDemo()
  const route = useRoute()
  const router = useRouter()
  return (step: CycleState) => {
    demo.set(step)
    const target = demoStepTarget(step, route.path)
    if (target) router.push(target)
  }
}
