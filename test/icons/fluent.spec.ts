import { describe, expect, it } from 'vitest'
import { fluentIconExists, stripFluentPrefix } from '../helpers/fluentIcons'
import { adminNav, tutorNav } from '~/composables/usePortalNav'
import { isFluentIcon } from '~/utils/icons'
import { adminNotifications, tutorNotifications } from '~/composables/useNotifications'
import { sourceIcon } from '~/utils/status'
import { useAcademyStore } from '~/stores/academy'

describe('fluent icon helper', () => {
  it('finds a known icon', () => {
    expect(fluentIconExists('grid-24-regular')).toBe(true)
  })

  it('rejects an unknown icon', () => {
    expect(fluentIconExists('definitely-not-an-icon-24-regular')).toBe(false)
  })

  it('strips the i-fluent- prefix', () => {
    expect(stripFluentPrefix('i-fluent-grid-24')).toBe('grid-24')
  })
})

describe('portal nav icons', () => {
  const items = [...adminNav, ...tutorNav]

  it('every nav icon is a fluent base name with regular and filled variants', () => {
    for (const item of items) {
      expect(item.icon, `${item.label} icon`).toMatch(/^i-fluent-[a-z0-9-]+-(?:16|20|24|28)$/)
      const base = stripFluentPrefix(item.icon)
      expect(fluentIconExists(`${base}-regular`), `${base}-regular`).toBe(true)
      expect(fluentIconExists(`${base}-filled`), `${base}-filled`).toBe(true)
    }
  })
})

describe('isFluentIcon', () => {
  it('detects fluent names', () => {
    expect(isFluentIcon('i-fluent-grid-24-regular')).toBe(true)
  })
  it('rejects emojis and initials', () => {
    expect(isFluentIcon('📐')).toBe(false)
    expect(isFluentIcon('A')).toBe(false)
  })
})

describe('data-side fluent icons', () => {
  it('notification icons exist in the fluent set', () => {
    for (const n of [...adminNotifications, ...tutorNotifications]) {
      expect(n.icon, n.icon).toMatch(/^i-fluent-/)
      expect(fluentIconExists(stripFluentPrefix(n.icon)), n.icon).toBe(true)
    }
  })

  it('source icons exist in the fluent set', () => {
    for (const source of ['Facebook', 'TikTok', 'Google']) {
      const icon = sourceIcon(source)
      expect(icon, icon).toMatch(/^i-fluent-/)
      expect(fluentIconExists(stripFluentPrefix(icon)), icon).toBe(true)
    }
  })

  // demoIndex.ts's data is spread into useAcademyStore's state (see
  // app/stores/academy.ts), not its own Pinia store: there is no
  // useDemoIndexStore. demoIntro.tips and demoGroups are the arrays that
  // carry `icon` fields.
  it('demo index icons exist in the fluent set', () => {
    const store = useAcademyStore()
    const icons = [
      ...store.demoIntro.tips.map((t: { icon: string }) => t.icon),
      ...store.demoGroups.map((g: { icon: string }) => g.icon),
    ]
    for (const icon of icons) {
      expect(icon, icon).toMatch(/^i-fluent-/)
      expect(fluentIconExists(stripFluentPrefix(icon)), icon).toBe(true)
    }
  })
})

describe('subject fluent icons', () => {
  it('every subject has a valid fluentIcon and keeps its emoji icon', () => {
    const store = useAcademyStore()
    for (const s of store.subjects) {
      expect(s.fluentIcon, s.name).toMatch(/^i-fluent-/)
      expect(fluentIconExists(stripFluentPrefix(s.fluentIcon)), s.fluentIcon).toBe(true)
      expect(isFluentIcon(s.icon), `${s.name} emoji icon must stay`).toBe(false)
    }
  })
})
