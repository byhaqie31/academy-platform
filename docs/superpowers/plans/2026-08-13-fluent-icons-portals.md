# Fluent Icons in the Portals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace emoji "icons" in the admin, tutor, and parent portals and the demo chrome with Fluent icons (Iconify) rendered through @nuxt/ui's `UIcon`, while marketing surfaces keep their emojis.

**Architecture:** Icon names stay where the emoji strings live today (nav composable, notification composable, status utils, stores). Nav items store a variant-less base name (`i-fluent-grid-24`) and `PortalShell` appends `-filled`/`-regular` by active state. `IconTile` and `EmptyState` learn to render `i-`-prefixed strings as `UIcon` while still rendering plain strings (initials, marketing emojis) as text. Subjects gain a `fluentIcon` field so one data source serves both marketing (emoji) and portals (Fluent). A vitest spec validates every referenced icon name against the installed `@iconify-json/fluent` set, so a typo fails the suite instead of silently rendering nothing.

**Tech Stack:** Nuxt 4, Vue 3 `<script setup lang="ts">`, @nuxt/ui v4 (`UIcon`, auto-imported in components), `@iconify-json/fluent` (devDependency), vitest + happy-dom (`~/` alias resolves to `app/` in tests).

**Spec:** `docs/superpowers/specs/2026-08-13-fluent-icons-design.md`

## Global Constraints

- **NO git commits or pushes, at all.** The user has instructed that no changes be committed — every task leaves its changes uncommitted in the working tree. Do not stage files. This overrides any skill instruction to commit per task.
- **Stay on the current branch** (`feat/parent-portal-and-admin-ops`). No new branches, no worktrees.
- Out of scope, do not touch: `app/components/v1/`, `app/components/landing/`, `app/components/marketing/`, `app/stores/siteContent.ts`, all marketing pages, the `MarketingSubject` list and `icon` field of `Subject` in `app/stores/academy.ts`.
- Emojis inside sentence copy stay (e.g. `👋` in greetings, `'Hello {academy} team 👋'`).
- Typographic marks `✓` `✕` embedded in label text stay (e.g. `'✓ Present'`, `'Assign class ✓'`, `'Attendance saved ✓'`). Standalone `✕` close buttons DO get swapped to `i-fluent-dismiss-20-regular`.
- Icon grid sizes: 24 for nav and tiles, 20 for dropdown rows and small chrome, 16 for inline-with-text glyphs. Variant is `regular` everywhere except the active nav item (`filled`).
- Copy conventions: sentence case, no em dashes (project rule) apply to any label text touched.
- All icon names referenced anywhere must pass the existence spec (`test/icons/fluent.spec.ts`). If a name in this plan turns out not to exist in the set, pick the closest Fluent equivalent that does and keep the spec green — the spec is the source of truth, not this plan's name guesses.
- Run tests with `npx vitest run <file>` (or `npx vitest run` for the whole suite).

---

### Task 1: Foundation — Fluent icon set + existence test helper

**Files:**
- Modify: `package.json` (devDependency)
- Create: `test/helpers/fluentIcons.ts`
- Test: `test/icons/fluent.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `fluentIconExists(name: string): boolean` (name WITHOUT the `i-fluent-` prefix, e.g. `'grid-24-regular'`) and `stripFluentPrefix(full: string): string` (turns `'i-fluent-grid-24'` into `'grid-24'`). Later tasks' specs import both from `test/helpers/fluentIcons.ts`.

- [ ] **Step 1: Install the Fluent Iconify set**

Run: `npm install -D @iconify-json/fluent`
Expected: package.json devDependencies gains `@iconify-json/fluent`. @nuxt/ui's bundled `@nuxt/icon` auto-discovers locally installed `@iconify-json/*` packages; no nuxt.config change needed.

- [ ] **Step 2: Write the failing test**

Create `test/icons/fluent.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { fluentIconExists, stripFluentPrefix } from '../helpers/fluentIcons'

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
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run test/icons/fluent.spec.ts`
Expected: FAIL — cannot resolve `../helpers/fluentIcons`.

- [ ] **Step 4: Write the helper**

Create `test/helpers/fluentIcons.ts`:

```ts
import { icons } from '@iconify-json/fluent'

/** True if `name` (WITHOUT the `i-fluent-` prefix) exists in the Fluent set. */
export function fluentIconExists(name: string): boolean {
  return Boolean(icons.icons[name] ?? icons.aliases?.[name])
}

/** 'i-fluent-grid-24' -> 'grid-24' */
export function stripFluentPrefix(full: string): string {
  return full.replace(/^i-fluent-/, '')
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run test/icons/fluent.spec.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Leave uncommitted**

Per the global constraint, do not stage or commit. Task is done when the tests pass.

---

### Task 2: Portal nav — data + PortalShell rendering

**Files:**
- Modify: `app/composables/usePortalNav.ts`
- Modify: `app/components/ui/PortalShell.vue`
- Test: `test/icons/fluent.spec.ts` (extend)

**Interfaces:**
- Consumes: `fluentIconExists`, `stripFluentPrefix` from Task 1.
- Produces: `NavItem.icon` is now a Fluent BASE name without variant, e.g. `'i-fluent-grid-24'`. Any component rendering a `NavItem` icon must append `-regular` or `-filled` itself. `PortalShell` demonstrates the pattern with a local helper `navIcon(item, active)`.

- [ ] **Step 1: Write the failing test**

Append to `test/icons/fluent.spec.ts`:

```ts
import { adminNav, tutorNav } from '~/composables/usePortalNav'

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/icons/fluent.spec.ts`
Expected: FAIL — nav icons are still emojis, regex assertion fails.

- [ ] **Step 3: Swap nav data to Fluent base names**

In `app/composables/usePortalNav.ts`, update the `NavItem` doc and both arrays:

```ts
export interface NavItem {
  to: string
  /** Fluent base name WITHOUT variant suffix, e.g. 'i-fluent-grid-24'.
   *  Renderers append '-regular' or '-filled' (active). */
  icon: string
  label: string
}

export const adminNav: NavItem[] = [
  { to: '/admin', icon: 'i-fluent-grid-24', label: 'Dashboard' },
  { to: '/admin/tonight', icon: 'i-fluent-video-24', label: 'Tonight' },
  { to: '/admin/students', icon: 'i-fluent-hat-graduation-24', label: 'Students' },
  { to: '/admin/educators', icon: 'i-fluent-people-24', label: 'Educators' },
  { to: '/admin/timetable', icon: 'i-fluent-table-24', label: 'Timetable' },
  { to: '/admin/schedule', icon: 'i-fluent-calendar-ltr-24', label: 'Schedule' },
  { to: '/admin/syllabus', icon: 'i-fluent-book-24', label: 'Syllabus' },
  { to: '/admin/collection', icon: 'i-fluent-receipt-24', label: 'Collection week' },
  { to: '/admin/billing', icon: 'i-fluent-payment-24', label: 'Billing' },
  { to: '/admin/payroll', icon: 'i-fluent-money-24', label: 'Payroll' },
  { to: '/admin/branches', icon: 'i-fluent-location-24', label: 'Branches' },
  { to: '/admin/settings', icon: 'i-fluent-settings-24', label: 'Settings' },
]

export const tutorNav: NavItem[] = [
  { to: '/tutor', icon: 'i-fluent-grid-24', label: 'Dashboard' },
  { to: '/tutor/schedule', icon: 'i-fluent-calendar-ltr-24', label: 'My schedule' },
  { to: '/tutor/classes', icon: 'i-fluent-book-24', label: 'Classes and students' },
  { to: '/tutor/lesson-plans', icon: 'i-fluent-notepad-24', label: 'Lesson plans' },
  { to: '/tutor/earnings', icon: 'i-fluent-money-24', label: 'My earnings' },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/icons/fluent.spec.ts`
Expected: PASS. If any `-filled` variant is missing, swap that entry for a Fluent name that has both variants and re-run.

- [ ] **Step 5: Render UIcon in PortalShell**

In `app/components/ui/PortalShell.vue` script, add below `activeItem`:

```ts
const navIcon = (item: NavItem, active: boolean) =>
  `${item.icon}-${active ? 'filled' : 'regular'}`
```

Desktop sidebar — replace

```html
<span class="w-5 text-center" style="font-size: 16px">{{ item.icon }}</span>
```

with

```html
<UIcon
  :name="navIcon(item, isActive(item.to))"
  class="w-5 h-5 shrink-0"
  :style="{ color: isActive(item.to) ? 'var(--color-brand-deep)' : 'var(--color-ink-soft)' }"
/>
```

Mobile pill nav — replace

```html
{{ item.icon }} {{ item.label }}
```

with

```html
<UIcon :name="navIcon(item, isActive(item.to))" class="inline-block align-[-2px]" :style="{ width: '14px', height: '14px' }" />
{{ item.label }}
```

Header search glyph — replace

```html
<span style="font-size: 14px">🔍</span>
```

with

```html
<UIcon name="i-fluent-search-16-regular" class="shrink-0 text-ink-soft" :style="{ width: '15px', height: '15px' }" />
```

- [ ] **Step 6: Run the full suite**

Run: `npx vitest run`
Expected: all green.

- [ ] **Step 7: Leave uncommitted**

Per the global constraint, do not stage or commit. Task is done when the suite passes.

---

### Task 3: IconTile and EmptyState render Fluent names

**Files:**
- Create: `app/utils/icons.ts`
- Modify: `app/components/ui/IconTile.vue`
- Modify: `app/components/ui/EmptyState.vue`
- Test: `test/icons/fluent.spec.ts` (extend)

**Interfaces:**
- Consumes: nothing new.
- Produces: `isFluentIcon(icon: string): boolean` in `app/utils/icons.ts` (true when the string starts with `i-`). `IconTile` and `EmptyState` keep their existing props (`icon: string`) but now render `UIcon` when `isFluentIcon(icon)` is true, plain text otherwise. All later tasks rely on this: passing a Fluent name to `IconTile`/`StatCard`/`EmptyState` just works, and initials/emojis still render as text.

- [ ] **Step 1: Write the failing test**

Append to `test/icons/fluent.spec.ts`:

```ts
import { isFluentIcon } from '~/utils/icons'

describe('isFluentIcon', () => {
  it('detects fluent names', () => {
    expect(isFluentIcon('i-fluent-grid-24-regular')).toBe(true)
  })
  it('rejects emojis and initials', () => {
    expect(isFluentIcon('📐')).toBe(false)
    expect(isFluentIcon('A')).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/icons/fluent.spec.ts`
Expected: FAIL — `~/utils/icons` does not exist.

- [ ] **Step 3: Write the util**

Create `app/utils/icons.ts`:

```ts
/** True when an icon string is an Iconify name ('i-...') rather than an emoji or initial. */
export function isFluentIcon(icon: string): boolean {
  return icon.startsWith('i-')
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/icons/fluent.spec.ts`
Expected: PASS.

- [ ] **Step 5: Teach IconTile the `i-` trick**

Replace `app/components/ui/IconTile.vue` template (script gains one import):

```vue
<script setup lang="ts">
import { pillStyle, type PillTone } from '~/utils/status'
import { isFluentIcon } from '~/utils/icons'

const props = withDefaults(
  defineProps<{ icon: string; tone?: PillTone; size?: number; radius?: number }>(),
  { tone: 'violet', size: 42, radius: 13 },
)
</script>

<template>
  <div
    class="grid place-items-center shrink-0"
    :style="{
      width: props.size + 'px',
      height: props.size + 'px',
      borderRadius: props.radius + 'px',
      fontSize: props.size * 0.45 + 'px',
      ...pillStyle(props.tone),
    }"
  >
    <UIcon
      v-if="isFluentIcon(props.icon)"
      :name="props.icon"
      :style="{ width: props.size * 0.52 + 'px', height: props.size * 0.52 + 'px' }"
    />
    <template v-else>{{ props.icon }}</template>
  </div>
</template>
```

- [ ] **Step 6: Same for EmptyState**

In `app/components/ui/EmptyState.vue`, import `isFluentIcon` from `~/utils/icons` in the script block, and replace the `{{ icon }}` interpolation with:

```html
<UIcon v-if="isFluentIcon(icon)" :name="icon" :style="{ width: '28px', height: '28px' }" class="text-ink-soft" />
<template v-else>{{ icon }}</template>
```

(Keep the element and classes that currently wrap `{{ icon }}` untouched; only the child content changes.)

- [ ] **Step 7: Run the full suite**

Run: `npx vitest run`
Expected: all green.

- [ ] **Step 8: Leave uncommitted**

Per the global constraint, do not stage or commit. Task is done when the suite passes.

---

### Task 4: Data-side swaps — notifications, source icons, demo index store

**Files:**
- Modify: `app/composables/useNotifications.ts`
- Modify: `app/utils/status.ts`
- Modify: `app/stores/demoIndex.ts`
- Test: `test/icons/fluent.spec.ts` (extend)

**Interfaces:**
- Consumes: `fluentIconExists`, `stripFluentPrefix` (Task 1); rendering via `IconTile` (Task 3) where applicable.
- Produces: `sourceIcon(source: string): string` now returns full Fluent names (`'i-fluent-megaphone-20-regular'` etc.). Notification `icon` fields and demoIndex `icon` fields are full Fluent names (WITH variant suffix — these are not nav items).

- [ ] **Step 1: Write the failing test**

Append to `test/icons/fluent.spec.ts`:

```ts
import { seedNotifications } from '~/composables/useNotifications'
import { sourceIcon } from '~/utils/status'
```

(Check the actual export name in `useNotifications.ts` first — if the notification arrays are module-level consts with a different name, import those. If they are not exported, export them.)

```ts
describe('data-side fluent icons', () => {
  it('notification icons exist in the fluent set', () => {
    for (const n of seedNotifications) {
      expect(n.icon).toMatch(/^i-fluent-/)
      expect(fluentIconExists(stripFluentPrefix(n.icon)), n.icon).toBe(true)
    }
  })

  it('source icons exist in the fluent set', () => {
    for (const source of ['Facebook', 'TikTok', 'Google']) {
      const icon = sourceIcon(source)
      expect(icon).toMatch(/^i-fluent-/)
      expect(fluentIconExists(stripFluentPrefix(icon)), icon).toBe(true)
    }
  })
})
```

Also add a demoIndex icon check, importing the store's exported seed data (adjust import to the store's actual export shape — Pinia store: instantiate with `useDemoIndexStore()`; `test/setup.ts` already activates a fresh Pinia per test):

```ts
import { useDemoIndexStore } from '~/stores/demoIndex'

  it('demo index icons exist in the fluent set', () => {
    const store = useDemoIndexStore()
    const icons = [
      ...store.howItWorks.map((s: { icon: string }) => s.icon),
      ...store.modules.map((m: { icon: string }) => m.icon),
    ]
    for (const icon of icons) {
      expect(fluentIconExists(stripFluentPrefix(icon)), icon).toBe(true)
    }
  })
```

(Adjust property names — `howItWorks` / `modules` — to whatever `demoIndex.ts` actually calls the arrays holding those `icon` fields. Read the store first.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/icons/fluent.spec.ts`
Expected: FAIL — icons are still emojis.

- [ ] **Step 3: Swap the data**

`app/composables/useNotifications.ts` — replace each emoji `icon` value:

| current | new |
|---|---|
| `'📝'` | `'i-fluent-notepad-20-regular'` |
| `'💳'` | `'i-fluent-payment-20-regular'` |
| `'✅'` | `'i-fluent-checkmark-circle-20-regular'` |
| `'🗓️'` | `'i-fluent-calendar-ltr-20-regular'` |
| `'🧑‍🏫'` | `'i-fluent-people-20-regular'` |
| `'🔔'` | `'i-fluent-alert-20-regular'` |
| `'💰'` | `'i-fluent-money-20-regular'` |
| `'👨‍👩‍👧'` | `'i-fluent-people-community-20-regular'` |

`app/utils/status.ts` — replace `sourceIcon`:

```ts
export function sourceIcon(source: string): string {
  return source === 'Facebook'
    ? 'i-fluent-megaphone-20-regular'
    : source === 'TikTok'
      ? 'i-fluent-music-note-2-20-regular'
      : 'i-fluent-search-20-regular'
}
```

`app/stores/demoIndex.ts` — swap `icon` fields only, copy strings stay:

| current | new |
|---|---|
| `'🚪'` | `'i-fluent-open-20-regular'` |
| `'🗂️'` | `'i-fluent-folder-open-20-regular'` |
| `'⬆️'` | `'i-fluent-arrow-up-20-regular'` |
| `'🚧'` | `'i-fluent-wrench-20-regular'` |
| `'🌏'` | `'i-fluent-globe-24-regular'` |
| `'🎯'` | `'i-fluent-target-24-regular'` |
| `'📊'` | `'i-fluent-data-bar-vertical-24-regular'` |
| `'🧑‍🏫'` | `'i-fluent-people-24-regular'` |
| `'👨‍👩‍👧'` | `'i-fluent-people-community-24-regular'` |
| `'📦'` | `'i-fluent-box-24-regular'` |
| `'📄'` | `'i-fluent-document-24-regular'` |

`'Hello {academy} team 👋'` stays as-is.

- [ ] **Step 4: Check the consumers render, not print**

Find where notification icons and demoIndex icons are rendered (`app/components/ui/NotificationDropdown.vue`, `app/components/ui/DemoNav.vue`, demo index pages). Where the icon is interpolated as text (`{{ n.icon }}`), either route it through `IconTile` or replace with `<UIcon :name="n.icon" ... />` sized to match the emoji it replaces (row icons ~16-18px). Where it already goes through `IconTile`, nothing to do (Task 3 handles it).

- [ ] **Step 5: Run the full suite**

Run: `npx vitest run`
Expected: all green. Fix any icon name the existence spec rejects by picking the closest existing Fluent name.

- [ ] **Step 6: Leave uncommitted**

Per the global constraint, do not stage or commit. Task is done when the suite passes.

---

### Task 5: Subjects get `fluentIcon`; portal call sites read it

**Files:**
- Modify: `app/types/index.ts` (Subject interface)
- Modify: `app/stores/academy.ts` (subjects array only — NOT `marketingSubjects`)
- Modify: `app/components/ui/SubjectChip.vue`
- Modify: `app/components/admin/SyllabusBank.vue`
- Modify: `app/components/admin/LessonPlanCards.vue`
- Modify: `app/components/tutor/HoursByClass.vue`
- Modify: `app/components/tutor/ClassCard.vue`
- Modify: `app/pages/admin/syllabus.vue`
- Modify: `app/pages/admin/educators/[id].vue`
- Modify: `app/pages/admin/students/[id].vue`
- Modify: `app/pages/tutor/classes/[id].vue`
- Test: `test/icons/fluent.spec.ts` (extend)

**Interfaces:**
- Consumes: `IconTile` fluent support (Task 3).
- Produces: `Subject.fluentIcon: string` (full Fluent name with variant). Portal components read `subject.fluentIcon`; marketing keeps reading `subject.icon`. Portal fallback icon is `'i-fluent-book-24-regular'` (replaces the `'📘'` fallback at portal call sites only).

- [ ] **Step 1: Write the failing test**

Append to `test/icons/fluent.spec.ts`:

```ts
import { useAcademyStore } from '~/stores/academy'

describe('subject fluent icons', () => {
  it('every subject has a valid fluentIcon and keeps its emoji icon', () => {
    const store = useAcademyStore()
    for (const s of store.subjects.list) {
      expect(s.fluentIcon, s.name).toMatch(/^i-fluent-/)
      expect(fluentIconExists(stripFluentPrefix(s.fluentIcon)), s.fluentIcon).toBe(true)
      expect(isFluentIcon(s.icon), `${s.name} emoji icon must stay`).toBe(false)
    }
  })
})
```

(Adjust `store.subjects.list` to however the store exposes the `Subject[]` — check `app/stores/academy.ts` exports; the components use `subjects.byName(...)`, so a `subjects` module with `list` likely exists.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/icons/fluent.spec.ts`
Expected: FAIL — `fluentIcon` is undefined.

- [ ] **Step 3: Add the field**

`app/types/index.ts` — inside `interface Subject`, after `icon: string`:

```ts
  /** Fluent icon (full name with variant) used on portal surfaces; `icon` stays the marketing emoji. */
  fluentIcon: string
```

`app/stores/academy.ts` — add to each subject in the `subjects` array:

| subject | fluentIcon |
|---|---|
| Matematik | `'i-fluent-calculator-24-regular'` |
| Bahasa Melayu | `'i-fluent-book-open-24-regular'` |
| Bahasa Inggeris | `'i-fluent-translate-24-regular'` |
| Sains | `'i-fluent-beaker-24-regular'` |
| Sejarah | `'i-fluent-history-24-regular'` |
| Geografi | `'i-fluent-globe-24-regular'` |
| Pendidikan Islam | `'i-fluent-building-mosque-24-regular'` |
| STEM | `'i-fluent-bot-24-regular'` |
| TVET | `'i-fluent-paint-brush-24-regular'` |

`marketingSubjects` is untouched.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/icons/fluent.spec.ts`
Expected: PASS (swap any rejected name for an existing Fluent equivalent).

- [ ] **Step 5: Point portal call sites at `fluentIcon`**

In each file below, change the subject icon read from `.icon` to `.fluentIcon` and the `'📘'`/`'📐'` fallbacks to `'i-fluent-book-24-regular'`:

- `app/components/ui/SubjectChip.vue`: `{{ meta?.icon }}` → `<UIcon v-if="meta" :name="meta.fluentIcon" class="inline-block align-[-2px]" :style="{ width: '13px', height: '13px' }" />`
- `app/components/admin/SyllabusBank.vue`: `:icon="subjects.byName(name)?.icon ?? '📘'"` → `:icon="subjects.byName(name)?.fluentIcon ?? 'i-fluent-book-24-regular'"`
- `app/components/admin/LessonPlanCards.vue`: `icon: meta?.icon ?? '📘'` → `icon: meta?.fluentIcon ?? 'i-fluent-book-24-regular'`
- `app/components/tutor/HoursByClass.vue`: `?.icon ?? '📐'` → `?.fluentIcon ?? 'i-fluent-book-24-regular'`
- `app/components/tutor/ClassCard.vue`: `<IconTile icon="📐" ...>` → `<IconTile icon="i-fluent-calculator-24-regular" ...>`
- `app/pages/admin/syllabus.vue`: `:icon="selMeta?.icon ?? '📘'"` → `:icon="selMeta?.fluentIcon ?? 'i-fluent-book-24-regular'"`
- `app/pages/admin/educators/[id].vue`: `:icon="subjects.byName(c.subject)?.icon ?? '📘'"` → `:icon="subjects.byName(c.subject)?.fluentIcon ?? 'i-fluent-book-24-regular'"`
- `app/pages/admin/students/[id].vue`: `icon: subjects.byName(name)?.icon ?? '📘'` → `icon: subjects.byName(name)?.fluentIcon ?? 'i-fluent-book-24-regular'`
- `app/pages/tutor/classes/[id].vue`: `<IconTile icon="📐" ...>` → `<IconTile icon="i-fluent-calculator-24-regular" ...>`

Marketing components (`app/components/marketing/SubjectCard.vue`, `app/components/v1/V1SubjectGrid.vue`) keep reading `.icon` — do not touch them.

- [ ] **Step 6: Run the full suite**

Run: `npx vitest run`
Expected: all green.

- [ ] **Step 7: Leave uncommitted**

Per the global constraint, do not stage or commit. Task is done when the suite passes.

---

### Task 6: Hardcoded emojis in portal templates

**Files (all Modify):**
- `app/components/admin/ProofThumb.vue`, `EnquiryList.vue`, `GuardianCard.vue`, `PaymentHistory.vue`, `AssignClassModal.vue`, `StudentFilters.vue`, `LessonPlanCards.vue` (📎 line)
- `app/components/tutor/LessonPlanCard.vue`
- `app/components/parent/ParentDemoPanel.vue`, `ParentDemoSheet.vue`, `ParentPackageCard.vue`, `ParentPaymentCard.vue`
- `app/components/ui/DemoWatermark.vue`, `DemoNav.vue`, `NotificationDropdown.vue`
- `app/pages/admin/index.vue`, `timetable.vue`, `payroll.vue`, `settings.vue`, `tonight.vue`, `billing.vue`, `branches.vue`, `syllabus.vue` (📎 line), `educators/[id].vue` (EmptyState), `students/[id].vue` (kept marks only)
- `app/pages/tutor/index.vue`
- `app/pages/portal/parent/index.vue`, `suspended.vue`

**Interfaces:**
- Consumes: `IconTile`/`EmptyState` fluent support (Task 3). `StatCard` passes `icon` straight to `IconTile`, so Fluent names in page data just work.
- Produces: nothing new — this task is pure swaps.

No new test — the existing existence spec does not see template literals. Correctness here is verified by the full suite staying green plus the Task 7 visual pass.

- [ ] **Step 1: Swap StatCard/data icons in pages**

These are `icon:` fields in page-level data arrays or `icon="..."` props on `StatCard`/`EmptyState`/`SectionHeading`-style components; all render through `IconTile`/`EmptyState` after Task 3. Exact mapping:

| file | current | new |
|---|---|---|
| `app/pages/admin/index.vue` | `'✨'` | `'i-fluent-sparkle-24-regular'` |
| | `'🧑‍🎓'` | `'i-fluent-hat-graduation-24-regular'` |
| | `'📚'` | `'i-fluent-book-24-regular'` |
| | `'💳'` | `'i-fluent-payment-24-regular'` |
| | `👋` in greeting | KEEP |
| `app/pages/admin/timetable.vue` | `"🗓️"` | `"i-fluent-calendar-ltr-24-regular"` |
| | `"🎫"` | `"i-fluent-ticket-diagonal-24-regular"` |
| | `"🧑‍🏫"` | `"i-fluent-people-24-regular"` |
| | `"📍"` | `"i-fluent-location-24-regular"` |
| `app/pages/admin/payroll.vue` | `'💰'` (both) | `'i-fluent-money-24-regular'` |
| | `'🧑‍🏫'` | `'i-fluent-people-24-regular'` |
| `app/pages/admin/settings.vue` | `'👥'` | `'i-fluent-people-24-regular'` |
| | `'💬'` | `'i-fluent-chat-24-regular'` |
| | `'🏷️'` | `'i-fluent-tag-24-regular'` |
| | `"⚙️"` | `"i-fluent-settings-24-regular"` |
| `app/pages/admin/tonight.vue` | `"🎥"` | `"i-fluent-video-24-regular"` |
| | `"🎫"` | `"i-fluent-ticket-diagonal-24-regular"` |
| | `"🙋"` | `"i-fluent-hand-wave-24-regular"` |
| | `"⚠️"` | `"i-fluent-warning-24-regular"` |
| `app/pages/admin/billing.vue` | `'✅'` | `'i-fluent-checkmark-circle-24-regular'` |
| | `'⚠️'` | `'i-fluent-warning-24-regular'` |
| | `'✓ Mark as paid'` | KEEP (typographic mark in label) |
| `app/pages/admin/branches.vue` | `'📍'` / `"📍"` | `'i-fluent-location-24-regular'` |
| | `'🧑‍🎓'` | `'i-fluent-hat-graduation-24-regular'` |
| | `'📚'` | `'i-fluent-book-24-regular'` |
| `app/pages/admin/educators/[id].vue` | `icon="🧑‍🏫"` (EmptyState) | `icon="i-fluent-people-24-regular"` |
| `app/pages/tutor/index.vue` | `'📚'` | `'i-fluent-book-24-regular'` |
| | `'🧑‍🎓'` | `'i-fluent-hat-graduation-24-regular'` |
| | `'💰'` | `'i-fluent-money-24-regular'` |
| | `👋` in greeting | KEEP |
| `app/pages/portal/parent/suspended.vue` | `icon="🔒"` (IconTile) | `icon="i-fluent-lock-closed-24-regular"` |

- [ ] **Step 2: Swap inline template glyphs for `<UIcon>`**

Each of these is an emoji directly in markup. Replace with a `UIcon` sized to the surrounding text (use the emoji's current font-size context; width/height in px as noted). Where the emoji sits inside a flex row, add `shrink-0`; where it sits inline in text, use `class="inline-block align-[-2px]"`.

| file | current | new |
|---|---|---|
| `app/components/admin/ProofThumb.vue` | `🧾` | `<UIcon name="i-fluent-receipt-20-regular" ... />` ~18px |
| `app/components/admin/EnquiryList.vue` | `💬 Follow-up` | `<UIcon name="i-fluent-chat-16-regular" ... />` ~12px + `Follow-up` |
| `app/components/admin/GuardianCard.vue` | `<span style="font-size: 15px">📞</span>` | `<UIcon name="i-fluent-call-16-regular" ... />` ~15px |
| | `💬 WhatsApp guardian` (AppButton text) | `<UIcon name="i-fluent-chat-16-regular" class="inline-block align-[-2px]" ... />` ~14px + ` WhatsApp guardian` |
| `app/components/admin/PaymentHistory.vue` | `{{ p.hasProof ? '🧾' : '—' }}` | `<UIcon v-if="p.hasProof" name="i-fluent-receipt-20-regular" ... />` ~16px, `<template v-else>—</template>` |
| `app/components/admin/AssignClassModal.vue` | `✕` (close button) | `<UIcon name="i-fluent-dismiss-20-regular" ... />` ~16px |
| | `Assign class ✓` | KEEP |
| `app/components/admin/StudentFilters.vue` | placeholder `"🔍 Search student name…"` | placeholder `"Search student name…"`; if the input has a wrapper row, prepend `<UIcon name="i-fluent-search-16-regular" ... />` ~14px; if not, wrap input in a flex div matching the input's current styling |
| `app/components/admin/LessonPlanCards.vue` | `📎 {{ card.material }}` | `<UIcon name="i-fluent-attach-16-regular" class="inline-block align-[-2px]" ... />` + `{{ card.material }}` |
| `app/pages/admin/syllabus.vue` | `📎 Materials` (AppButton) | `<UIcon name="i-fluent-attach-16-regular" class="inline-block align-[-2px]" ... />` + ` Materials` |
| `app/components/tutor/LessonPlanCard.vue` | `📎 {{ plan.material }}` | same attach pattern as LessonPlanCards |
| `app/components/tutor/AttendanceSegmented.vue` | `'✓ Present'`, `'✕ Absent'` labels | KEEP (typographic marks in data labels) |
| `app/components/parent/ParentDemoPanel.vue` | `✨ Demo` | `<UIcon name="i-fluent-sparkle-16-regular" class="inline-block align-[-2px]" ... />` + ` Demo` |
| `app/components/parent/ParentDemoSheet.vue` | `🎬 Demo` | same sparkle pattern (`i-fluent-sparkle-16-regular`) for consistency |
| | `✕` (close button) | `<UIcon name="i-fluent-dismiss-20-regular" ... />` ~16px |
| `app/components/parent/ParentPackageCard.vue` | `📦 Pakej {{ childFirst }}` | `<UIcon name="i-fluent-box-16-regular" class="inline-block align-[-2px]" ... />` + ` Pakej {{ childFirst }}` |
| `app/components/parent/ParentPaymentCard.vue` | `icon: '✅'` | `icon: 'i-fluent-checkmark-circle-20-regular'` |
| | `icon: '⚠️'` | `icon: 'i-fluent-warning-20-regular'` |
| | `icon: '🕐'` | `icon: 'i-fluent-clock-20-regular'` |
| | `icon: '🔒'` | `icon: 'i-fluent-lock-closed-20-regular'` |
| | `icon: '💳'` | `icon: 'i-fluent-payment-20-regular'` |
| | (check renderer) | if the card interpolates `{{ state.icon }}` as text, swap to `<UIcon :name="state.icon" ... />` sized to match |
| `app/components/ui/DemoWatermark.vue` | `<span style="font-size: 13px">✨</span>` | `<UIcon name="i-fluent-sparkle-16-regular" ... />` ~13px |
| `app/components/ui/DemoNav.vue` | `✕` (close button) | `<UIcon name="i-fluent-dismiss-20-regular" ... />` ~16px |
| | `⚠️` in code comment | KEEP (comment, not UI) |
| `app/components/ui/NotificationDropdown.vue` | `<span style="font-size: 16px">🔔</span>` | `<UIcon name="i-fluent-alert-20-regular" ... />` ~18px, keep the bell button's existing classes |
| `app/pages/admin/students/[id].vue` | `✓ Present` / `✕ Absent` spans | KEEP (typographic, matches AttendanceSegmented) |
| `app/pages/tutor/classes/[id].vue` | `✓ Present` / `✕ Absent` / `Attendance saved ✓` | KEEP |
| `app/pages/portal/parent/index.vue` | `🎒 Kelas hari ini` | `<UIcon name="i-fluent-backpack-16-regular" class="inline-block align-[-2px]" ... />` + ` Kelas hari ini` |
| | `📅 Jadual minggu ini` | `<UIcon name="i-fluent-calendar-ltr-16-regular" ... />` + ` Jadual minggu ini` |
| | `✅ Kehadiran` | `<UIcon name="i-fluent-checkmark-circle-16-regular" ... />` + ` Kehadiran` |
| | `Salam ... 👋` | KEEP |
| `app/pages/portal/parent/suspended.vue` | `⚡` | `<UIcon name="i-fluent-flash-16-regular" ... />` ~15px |
| | `💬 Hubungi kami` | `<UIcon name="i-fluent-chat-16-regular" class="inline-block align-[-2px]" ... />` + ` Hubungi kami` |

- [ ] **Step 3: Sweep for leftovers**

Run:

```bash
grep -rnE "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]" app/components/admin app/components/tutor app/components/parent app/components/ui app/pages/admin app/pages/tutor app/pages/portal/parent app/composables/usePortalNav.ts app/composables/useNotifications.ts app/utils/status.ts app/stores/demoIndex.ts
```

Expected remaining hits ONLY: greeting `👋`s, `✓`/`✕` typographic marks in labels, `⚠️` in the DemoNav code comment, `'Hello {academy} team 👋'`. Anything else: swap it using the same patterns.

- [ ] **Step 4: Run the full suite**

Run: `npx vitest run`
Expected: all green.

- [ ] **Step 5: Leave uncommitted**

Per the global constraint, do not stage or commit. Task is done when the suite passes and the sweep is clean.

---

### Task 7: Visual verification pass

**Files:**
- No planned modifications (fixes only if the pass finds breakage).

**Interfaces:**
- Consumes: everything above.
- Produces: verified working portals; screenshots for the user.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (background). Wait for it to report the local URL (default `http://localhost:3000`).

- [ ] **Step 2: Walk the surfaces with the webapp-testing skill**

Use the `webapp-testing` skill (Playwright) to load and screenshot each of:

1. `/admin` — sidebar shows Fluent icons, active item filled + tinted, stat cards show Fluent tiles, search glyph, bell icon.
2. `/admin/students` — search field, filters, subject chips.
3. `/tutor` — tutor nav, stat cards.
4. `/portal/parent` — section header icons, payment card state icon, package card, join buttons.
5. `/portal/parent/suspended` — lock tile, flash bullet, WhatsApp button.
6. `/` and `/subjects` — MUST still show emojis (marketing untouched).
7. Mobile viewport (390px wide) on `/admin` — pill nav icons render inline with labels.

Check the dev server console/browser console for `[Icon]` warnings about unknown icons; any warning = fix the name and re-check.

- [ ] **Step 3: Run the full suite one last time**

Run: `npx vitest run`
Expected: all green.

- [ ] **Step 4: Report**

Show the user the screenshots and the leftover-emoji sweep output; note any icon substitutions made where a planned name did not exist. Leave everything uncommitted for the user to review.
