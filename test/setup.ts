import { beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Fresh Pinia per test so seeded store state never leaks between cases.
beforeEach(() => {
  setActivePinia(createPinia())
})
