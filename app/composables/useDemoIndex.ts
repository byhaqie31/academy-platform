import { useAcademyStore } from '~/stores/academy'
import { adminNav, tutorNav } from '~/composables/usePortalNav'
import type { DemoEntry, DemoGroup } from '~/types'

// swap internals for API calls when backend lands; signature stays stable
/**
 * The internal directory at /demo.
 *
 * Admin and tutor entries are built from adminNav and tutorNav rather than
 * being listed again in the seed. Adding a portal screen to the nav puts it in
 * the directory automatically, so the two can never disagree.
 */
export function useDemoIndex() {
  const store = useAcademyStore()
  const notes = store.demoNotes as Record<string, string>

  const fromNav = (nav: { to: string, label: string }[]): DemoEntry[] =>
    nav.map((item) => ({
      label: item.label,
      to: item.to,
      note: notes[item.to] ?? '',
      status: 'live' as const,
    }))

  const groups: DemoGroup[] = (store.demoGroups as DemoGroup[]).map((g) => {
    if (g.key === 'admin') return { ...g, entries: fromNav(adminNav) }
    if (g.key === 'tutor') return { ...g, entries: fromNav(tutorNav) }
    return g
  })

  const liveCount = groups.reduce(
    (n, g) => n + g.entries.filter((e) => e.status === 'live').length,
    0,
  )

  return {
    intro: store.demoIntro,
    groups,
    liveCount,
    plannedCount: groups.reduce(
      (n, g) => n + g.entries.filter((e) => e.status === 'planned').length,
      0,
    ),
  }
}
