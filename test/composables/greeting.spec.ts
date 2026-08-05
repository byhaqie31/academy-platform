import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { useGreeting } from '~/composables/useGreeting'

afterEach(() => {
  vi.useRealTimers()
})

// useGreeting calls onMounted/onBeforeUnmount, so it needs a real component
// instance. vitest.config.ts sets environment: 'happy-dom', so mounting works.
function greetingAt(iso: string) {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(iso))
  let g!: ReturnType<typeof useGreeting>
  const wrapper = mount({
    setup() {
      g = useGreeting()
      return () => null
    },
  })
  const snapshot = { greeting: g.greeting.value, dateLabel: g.dateLabel.value }
  wrapper.unmount()
  return snapshot
}

describe('useGreeting', () => {
  it('greets in English across the three hour bands', () => {
    expect(greetingAt('2026-07-09T06:00:00').greeting).toBe('Good morning')
    expect(greetingAt('2026-07-09T13:00:00').greeting).toBe('Good afternoon')
    expect(greetingAt('2026-07-09T21:00:00').greeting).toBe('Good evening')
  })

  it('keeps the existing hour boundaries', () => {
    expect(greetingAt('2026-07-09T04:59:00').greeting).toBe('Good evening')
    expect(greetingAt('2026-07-09T05:00:00').greeting).toBe('Good morning')
    expect(greetingAt('2026-07-09T11:59:00').greeting).toBe('Good morning')
    expect(greetingAt('2026-07-09T12:00:00').greeting).toBe('Good afternoon')
    expect(greetingAt('2026-07-09T18:59:00').greeting).toBe('Good afternoon')
    expect(greetingAt('2026-07-09T19:00:00').greeting).toBe('Good evening')
  })

  it('DAYS stays Sunday-first because it is indexed by getDay()', () => {
    // 2026-07-05 is a Sunday, 2026-07-09 is a Thursday.
    expect(greetingAt('2026-07-05T10:00:00').dateLabel).toBe('Sun, 5 July 2026')
    expect(greetingAt('2026-07-09T10:00:00').dateLabel).toBe('Thu, 9 July 2026')
  })

  it('names months in English', () => {
    expect(greetingAt('2026-03-02T10:00:00').dateLabel).toContain('March')
    expect(greetingAt('2026-05-02T10:00:00').dateLabel).toContain('May')
    expect(greetingAt('2026-08-02T10:00:00').dateLabel).toContain('August')
  })
})
