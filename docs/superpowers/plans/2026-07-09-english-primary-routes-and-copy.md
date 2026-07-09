# English-primary routes and copy — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make English the primary language of the Academy Platform mockup — English URL paths, English UI copy, no Malay sub-labels — while preserving Malaysian domain data.

**Architecture:** Narrow `Class.day` from `string` to a `Day` union *first*, so that renaming Malay day values turns four silent runtime failures into compile errors. Then rename routes with `git mv`, collapse `NavItem` to a single `label`, and sweep copy portal by portal. No i18n layer; strings are replaced in place, and the pre-pivot Malay state is preserved by the tag `hz-academy-malay-demo`.

**Tech Stack:** Nuxt 4 (`app/` dir), Vue 3 `<script setup lang="ts">`, TypeScript, Pinia, Vitest, @nuxt/ui v4, Tailwind v4.

**Spec:** `docs/superpowers/specs/2026-07-09-english-primary-routes-and-copy-design.md`

## Global Constraints

Every task's requirements implicitly include this section.

- **Sentence case everywhere.** No title case headers.
- **No em dashes.** Use commas, periods, or "to" for ranges. En-dashes as numeric range glyphs (`3PM–9PM`) are permitted.
- **Warm, non-corporate tone.** Tagline: "Simple, effortless, human."
- **Never inline data in components.** All data access goes through composables. This change must not introduce new inlined data.
- **Translate** product language: UI chrome, headings, buttons, labels, nav, empty states, notification copy, day names, month names, greeting strings, and `ampm` values.
- **Never translate** domain fact: subject names (`Matematik`, `Sains`, `Bahasa Melayu`, `Bahasa Inggeris`, `Sejarah`, `Geografi`, `Pendidikan Islam`), school levels (`Tahun 1`–`Tahun 6`, `Tingkatan 1`–`Tingkatan 5`), class names (`Tahun 4 Bestari`, `SPM Intensif`), person names and honorifics (`Puan Aisyah`, `Encik`, `Cik`, `Tuan`), branch names (`Kota Warisan, Sepang`), school names, IC numbers, RM amounts.
- **`Mei Yi` is a student name, not the month Mei.** It must survive every sweep.
- Run `npm run typecheck` and `npm test` before every commit.
- Do **not** touch `config/academy.ts`'s `name`, `shortName`, or `logoText`. The Hz Academy to SaaS rebrand is a separate spec. When this plan is done, `config/academy.ts` still reads `name: 'Hz Academy'`.

## File structure

| File | Responsibility | Task |
|---|---|---|
| `app/types/index.ts` | Add `Day` union; retype `Class.day`, `Class.ampm` | 1 |
| `app/stores/academy.ts` | English `day` and `ampm` seed values; `AgendaRow.ampm` | 1 |
| `app/composables/useSchedule.ts` | `DAYS` = grid column order, Mon–Sat | 1 |
| `app/composables/useGreeting.ts` | `DAYS` (Sun-first, `getDay()`-indexed), `MONTHS`, greeting strings | 2 |
| `app/components/tutor/TodayClasses.vue` | `c.day === 'Mon'` filter | 1 |
| `app/pages/tutor/index.vue` | `c.day === 'Mon'` filter | 1 |
| `app/pages/**` (7 route files) | Renamed via `git mv` | 3 |
| `app/composables/usePortalNav.ts` | `NavItem` loses `ms`; `en` becomes `label` | 4 |
| `config/academy.ts` | `tagline`, `branches[].hours` | 5 |
| Copy sweeps | Portal by portal | 6–9 |
| `CLAUDE.md`, `docs/superpowers/PROJECT-CONTEXT.md` | Conventions and route references | 10 |
| `test/composables/schedule.spec.ts` | **New.** Regression guard for the silent day-mismatch failure | 1 |
| `test/composables/greeting.spec.ts` | **New.** Guard for the Sun-first `getDay()` indexing | 2 |

Verified before planning: `vitest.config.ts` sets `environment: 'happy-dom'`, and `@vue/test-utils` is an existing dependency, so Task 2's test can mount a component without new tooling. `useAttendance`'s status keys are already `'present' | 'late' | 'absent'`, so Task 8 changes labels only.

---

### Task 1: Narrow `Day`, rename day and `ampm` values

This is the load-bearing task. Do it first and do not batch it with anything else.

`Class.day` is currently `string`. Four sites compare it against the literal `'Isnin'`. Renaming the seed values without this type change leaves all four compiling and matching nothing: the tutor dashboard reports "Classes today: 0" and the schedule grid renders blank columns, with no error anywhere.

**Files:**
- Modify: `app/types/index.ts` (add `Day`, `Ampm`; retype `Class.day:75`, `Class.ampm:77`)
- Modify: `app/stores/academy.ts` (12 `day:` values, 12+ `ampm:` values, `AgendaRow` at `:187`)
- Modify: `app/composables/useSchedule.ts:4`
- Modify: `app/components/tutor/TodayClasses.vue:13,17`
- Modify: `app/pages/tutor/index.vue:20,21,26`
- Test: `test/composables/schedule.spec.ts` (create)

**Interfaces:**
- Consumes: nothing.
- Produces: `Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'` and `Ampm = 'AFTERNOON' | 'EVENING'`, both exported from `app/types/index.ts`. Task 2 imports `Day`.

Day value mapping (the store uses only six; `'Sun'` exists solely for `useGreeting` in Task 2):

| Malay | English |
|---|---|
| `Isnin` | `Mon` |
| `Selasa` | `Tue` |
| `Rabu` | `Wed` |
| `Khamis` | `Thu` |
| `Jumaat` | `Fri` |
| `Sabtu` | `Sat` |
| `Ahad` | `Sun` |

`ampm` mapping: `PETANG` → `AFTERNOON`, `MALAM` → `EVENING`.

- [ ] **Step 1: Write the failing test**

Create `test/composables/schedule.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { useSchedule } from '~/composables/useSchedule'
import { useAcademyStore } from '~/stores/academy'

describe('useSchedule day values', () => {
  it('exposes English weekday columns, Monday first', () => {
    const { days } = useSchedule()
    expect(days).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
  })

  it('every seeded class sits on a day the grid actually renders', () => {
    const store = useAcademyStore()
    const { days } = useSchedule()
    const orphans = store.classes.filter((c) => !days.includes(c.day))
    expect(orphans).toEqual([])
  })

  it('grid() resolves at least one class into a cell', () => {
    const { grid } = useSchedule()
    const cells = grid().flatMap((row) => row.cells).filter(Boolean)
    expect(cells.length).toBeGreaterThan(0)
  })

  it('at least one class falls on Monday, so the tutor dashboard is non-empty', () => {
    const store = useAcademyStore()
    expect(store.classes.some((c) => c.day === 'Mon')).toBe(true)
  })

  it('ampm labels are English', () => {
    const store = useAcademyStore()
    const values = new Set(store.classes.map((c) => c.ampm))
    expect([...values].sort()).toEqual(['AFTERNOON', 'EVENING'])
  })
})
```

The third and fourth cases are the real regression guards. They are the two failures that produce no error, only an empty screen.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run test/composables/schedule.spec.ts`

Expected: FAIL. First case reports `['Isnin', 'Selasa', ...]` received, `['Mon', ...]` expected.

- [ ] **Step 3: Add the `Day` and `Ampm` types**

In `app/types/index.ts`, above `export interface Class`:

```ts
/** Weekday keys. 'Sun' carries no classes; useGreeting needs all seven for Date.getDay(). */
export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

/** Rendered raw as an uppercase label on schedule cards. */
export type Ampm = 'AFTERNOON' | 'EVENING'
```

Then retype the two `Class` fields (currently `day: string` at line 75, `ampm: string` at line 77):

```ts
  day: Day
  time: string
  ampm: Ampm
```

- [ ] **Step 4: Run typecheck to enumerate every breakage**

Run: `npm run typecheck`

Expected: FAIL, listing errors in `app/stores/academy.ts`, `app/composables/useSchedule.ts`, `app/components/tutor/TodayClasses.vue`, and `app/pages/tutor/index.vue`. This list *is* your worklist for Step 5. If a file you expected is absent, stop and find out why before continuing.

- [ ] **Step 5: Rename the seed values**

In `app/stores/academy.ts`, apply the day and `ampm` mappings above to all `day:` and `ampm:` values, including the `agenda` array at `:195`. `AgendaRow` is declared in this file at `:187`, not in `types/` — retype its `ampm` field:

```ts
export interface AgendaRow {
  time: string
  ampm: Ampm
  subject: string
  cls: string
  educatorId: string
  branchId: string
}
```

Import `Ampm` alongside the store's existing type imports.

Do **not** touch `subject`, `cls`, `level`, or `roster` values. `Tahun 4 Bestari` stays. `Mei Yi` stays.

- [ ] **Step 6: Update `useSchedule.ts`**

Line 4 becomes:

```ts
const DAYS: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
```

Import `Day` from `~/types` on line 2. This array defines **grid column order** and deliberately omits Sunday. Do not add `'Sun'` to it.

- [ ] **Step 7: Update the two `'Isnin'` comparisons**

`app/components/tutor/TodayClasses.vue` — line 13 comment and line 17 filter:

```ts
// Today is Mon in the prototype's curated snapshot.
    .filter((c) => c.day === 'Mon'),
```

`app/pages/tutor/index.vue` — lines 20, 21, and the `delta` on line 26:

```ts
// Derived, never hand-entered: today is Mon in this curated snapshot.
const todayCount = computed(() => myClasses.filter((c) => c.day === 'Mon').length)
```

```ts
  { icon: '📚', tone: 'pink' as const, value: String(todayCount.value), label: 'Classes today', sub: 'Kelas hari ini', delta: 'Mon' },
```

Leave `sub: 'Kelas hari ini'` alone for now. Task 8 sweeps tutor copy; changing it here would blur two commits.

- [ ] **Step 8: Run typecheck and the tests**

Run: `npm run typecheck && npx vitest run test/composables/schedule.spec.ts`

Expected: typecheck clean, all five cases PASS.

- [ ] **Step 9: Run the full suite**

Run: `npm test`

Expected: all pass. `test/utils/validation.spec.ts` asserts on `'Matematik'` and must still pass **unmodified**. If it fails, you translated a subject name.

- [ ] **Step 10: Commit**

```bash
git add app/types/index.ts app/stores/academy.ts app/composables/useSchedule.ts \
        app/components/tutor/TodayClasses.vue app/pages/tutor/index.vue \
        test/composables/schedule.spec.ts
git commit -m "refactor: narrow Class.day to a Day union, rename day and ampm values to English

Renaming day values while day was typed string would have left four literal
comparisons compiling and matching nothing. The union turns them into compile
errors. Adds a regression test for the two silent-failure surfaces."
```

---

### Task 2: English greeting, days, and months

**Files:**
- Modify: `app/composables/useGreeting.ts`
- Test: `test/composables/greeting.spec.ts` (create)

**Interfaces:**
- Consumes: `Day` from `app/types/index.ts` (Task 1).
- Produces: no signature change. `useGreeting()` still returns `{ now, greeting, dateLabel }`.

`useGreeting`'s `DAYS` array is **not** the same as `useSchedule`'s. It has seven entries, starts at **Sunday**, and is indexed by `Date.getDay()`. Copying `useSchedule`'s Monday-first array into it produces an off-by-one weekday, every day, silently.

- [ ] **Step 1: Write the failing test**

Create `test/composables/greeting.spec.ts`:

```ts
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
```

The Sunday case is the point of that third test. `Mac` → `March` and `Mei` → `May` are the two months whose Malay names are short enough to be missed by eye.

`@vue/test-utils` and `happy-dom` are both already project dependencies. Do not add a test helper module for this.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run test/composables/greeting.spec.ts`

Expected: FAIL. `'Selamat pagi'` received where `'Good morning'` expected.

- [ ] **Step 3: Rewrite the constants and greeting**

`app/composables/useGreeting.ts`, lines 3 to 8:

```ts
import type { Day } from '~/types'

// Indexed by Date.getDay(), so this MUST start at Sunday. Not the same array
// as useSchedule's DAYS, which is Monday-first grid column order.
const DAYS: Day[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
```

Lines 27 to 33:

```ts
  // morning 05:00–11:59 · afternoon 12:00–18:59 · evening 19:00–04:59
  const greeting = computed(() => {
    const h = now.value.getHours()
    if (h >= 5 && h < 12) return 'Good morning'
    if (h >= 12 && h < 19) return 'Good afternoon'
    return 'Good evening'
  })
```

Leave `dateLabel`'s template literal untouched; only the arrays it reads change.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run test/composables/greeting.spec.ts`

Expected: all four cases PASS.

- [ ] **Step 5: Run typecheck and full suite**

Run: `npm run typecheck && npm test`

Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add app/composables/useGreeting.ts test/composables/greeting.spec.ts
git commit -m "refactor: English greeting, weekday, and month names

useGreeting's DAYS is Sunday-first because it is indexed by getDay(). Test
pins that, since copying useSchedule's Monday-first array here would shift
every weekday by one, silently."
```

---

### Task 3: Rename routes

**Files:**
- Rename: seven page files, via `git mv`
- Modify: eleven inbound links across eight files, plus one string concat

**Interfaces:**
- Consumes: nothing.
- Produces: the new paths, consumed by Task 4's `usePortalNav`.

Route references are all static strings. There is no `navigateTo` and no `router.push` anywhere in `app/`, and no route name appears in `test/` or `nuxt.config.ts`.

- [ ] **Step 1: Move the page files**

```bash
git mv app/pages/portal/ibubapa.vue app/pages/portal/parents.vue
git mv app/pages/daftar.vue app/pages/register.vue
git mv app/pages/tutor/jadual.vue app/pages/tutor/schedule.vue
git mv app/pages/tutor/rancangan.vue app/pages/tutor/lesson-plans.vue
git mv app/pages/tutor/pendapatan.vue app/pages/tutor/earnings.vue
git mv app/pages/tutor/kelas app/pages/tutor/classes
```

That last move carries both `index.vue` and `[id].vue`.

- [ ] **Step 2: Update the ten path literals**

| File | Old | New |
|---|---|---|
| `app/components/marketing/SiteFooter.vue` | `/portal/ibubapa` | `/portal/parents` |
| `app/components/marketing/SiteFooter.vue` | `/daftar` | `/register` |
| `app/components/marketing/LoginDropdown.vue:27` | `/portal/ibubapa` | `/portal/parents` |
| `app/components/marketing/BranchGrid.vue` (x2) | `/daftar` | `/register` |
| `app/components/marketing/SiteHeader.vue` | `/daftar` | `/register` |
| `app/components/marketing/Hero.vue` | `/daftar` | `/register` |
| `app/components/marketing/CtaBanner.vue` | `/daftar` | `/register` |
| `app/components/tutor/TodayClasses.vue:28` | `/tutor/jadual` | `/tutor/schedule` |
| `app/components/tutor/PlansThisWeek.vue:16` | `/tutor/rancangan` | `/tutor/lesson-plans` |
| `app/components/tutor/EarningsMini.vue:28` | `/tutor/pendapatan` | `/tutor/earnings` |
| `app/pages/tutor/index.vue` | `/tutor/pendapatan` | `/tutor/earnings` |
| `app/pages/tutor/classes/[id].vue` (x2) | `/tutor/kelas` | `/tutor/classes` |

- [ ] **Step 3: Update the string concatenation**

`app/components/tutor/TutorScheduleGrid.vue:52`. A regex for `to="/tutor/kelas"` will not find this:

```vue
            :to="'/tutor/classes/' + cell.classId"
```

- [ ] **Step 4: Verify no old path survives**

Run:

```bash
grep -rnE '/(daftar|portal/ibubapa|tutor/(jadual|kelas|pendapatan|rancangan))' app/
```

Expected: no output. `usePortalNav.ts` still holds four old `to:` values at this point — if the grep reports them, that is correct and Task 4 fixes them. If it reports anything else, fix it now.

- [ ] **Step 5: Update `usePortalNav.ts` paths only**

Change the four `to:` values in `tutorNav`. Leave `en`/`ms` alone; Task 4 owns those.

```ts
  { to: '/tutor/schedule', icon: '🗓️', en: 'Jadual Saya', ms: 'My schedule' },
  { to: '/tutor/classes', icon: '📚', en: 'Kelas & Pelajar', ms: 'Classes' },
  { to: '/tutor/lesson-plans', icon: '📝', en: 'Rancangan', ms: 'Lesson plans' },
  { to: '/tutor/earnings', icon: '💰', en: 'Pendapatan', ms: 'My earnings' },
```

- [ ] **Step 6: Verify the app routes**

Run: `npm run dev`, then load each of `/register`, `/portal/parents`, `/tutor/schedule`, `/tutor/classes`, `/tutor/lesson-plans`, `/tutor/earnings`. Click into a class from `/tutor/schedule` to exercise the concatenated path from Step 3.

Expected: all six load. The schedule grid cell navigates to `/tutor/classes/<id>`, not a 404.

- [ ] **Step 7: Run typecheck and tests, then commit**

Run: `npm run typecheck && npm test`

```bash
git add -A app/
git commit -m "refactor: rename Malay routes to English

ibubapa->parents, daftar->register, jadual->schedule, kelas->classes,
rancangan->lesson-plans, pendapatan->earnings. Includes the concatenated
path in TutorScheduleGrid that a path-literal grep would miss."
```

---

### Task 4: Collapse `NavItem` to a single `label`

`tutorNav` currently has `en` and `ms` **swapped**: `en: 'Jadual Saya'` puts Malay in the English field, and `ms: 'My schedule'` puts English in the Malay field. Collapsing to one field fixes both errors at once.

**Files:**
- Modify: `app/composables/usePortalNav.ts`
- Modify: every component rendering `item.en` or `item.ms` (find them in Step 2)

**Interfaces:**
- Consumes: the route paths from Task 3.
- Produces: `interface NavItem { to: string; icon: string; label: string }`, exported from `app/composables/usePortalNav.ts`. Both `adminNav` and `tutorNav` are `NavItem[]`.

- [ ] **Step 1: Rewrite `usePortalNav.ts`**

```ts
export interface NavItem {
  to: string
  icon: string
  label: string
}

export const adminNav: NavItem[] = [
  { to: '/admin', icon: '📊', label: 'Dashboard' },
  { to: '/admin/students', icon: '🧑‍🎓', label: 'Students' },
  { to: '/admin/educators', icon: '🧑‍🏫', label: 'Educators' },
  { to: '/admin/schedule', icon: '🗓️', label: 'Schedule' },
  { to: '/admin/syllabus', icon: '📚', label: 'Syllabus' },
  { to: '/admin/billing', icon: '💳', label: 'Billing' },
  { to: '/admin/payroll', icon: '💰', label: 'Payroll' },
  { to: '/admin/branches', icon: '📍', label: 'Branches' },
  { to: '/admin/settings', icon: '⚙️', label: 'Settings' },
]

export const tutorNav: NavItem[] = [
  { to: '/tutor', icon: '📊', label: 'Dashboard' },
  { to: '/tutor/schedule', icon: '🗓️', label: 'My schedule' },
  { to: '/tutor/classes', icon: '📚', label: 'Classes and students' },
  { to: '/tutor/lesson-plans', icon: '📝', label: 'Lesson plans' },
  { to: '/tutor/earnings', icon: '💰', label: 'My earnings' },
]
```

- [ ] **Step 2: Run typecheck to find every consumer**

Run: `npm run typecheck`

Expected: FAIL, with `Property 'en' does not exist on type 'NavItem'` at each render site. Check `app/components/ui/PortalShell.vue` first; it is the shared nav renderer.

- [ ] **Step 3: Update each consumer to render `item.label`**

Remove the Malay sub-label element entirely wherever `item.ms` was rendered. Do not leave an empty `<div>` behind — check the surrounding flex or grid still spaces correctly without it.

- [ ] **Step 4: Verify**

Run: `npm run typecheck && npm test`

Then `npm run dev` and load `/admin` and `/tutor`. Confirm both sidebars show nine and five English items respectively, correctly aligned with no orphaned spacing where the sub-label used to be.

- [ ] **Step 5: Commit**

```bash
git add app/composables/usePortalNav.ts app/components/
git commit -m "refactor: collapse NavItem to a single English label

tutorNav had en and ms swapped: Malay sat in the en field and English in ms.
One field removes both errors."
```

---

### Task 5: `config/academy.ts`

**Files:**
- Modify: `config/academy.ts:9,21-24`

**Interfaces:**
- Consumes: nothing. Produces: nothing. `Academy` type is unchanged.

Change exactly two things. Leave `name: 'Hz Academy'`, `shortName`, `logoText`, `since`, and all `contact` values alone — the rebrand is a separate spec.

- [ ] **Step 1: Translate the tagline and hours**

```ts
  tagline: 'Trusted since 2014',
```

```ts
    { id: 'kw', name: 'Kota Warisan, Sepang', short: 'Kota Warisan', area: 'Sepang', hours: 'Mon to Sat · 3PM–9PM' },
    { id: 'sk', name: 'Taman Sutera, Kajang', short: 'Kajang', area: 'Kajang', hours: 'Mon to Sat · 2PM–9PM' },
    { id: 'ix', name: 'Taman Ixora', short: 'Ixora', area: 'Seri Kembangan', hours: 'Mon to Sun · 3PM–9PM' },
    { id: 'pk', name: 'Pekan', short: 'Pekan', area: 'Pahang', hours: 'Mon to Sat · 3PM–8PM' },
```

Branch `name`, `short`, and `area` are Malaysian place names and stay exactly as they are.

- [ ] **Step 2: Verify and commit**

Run: `npm run typecheck && npm test`

```bash
git add config/academy.ts
git commit -m "refactor: English tagline and branch hours"
```

---

### Task 6: Parent portal copy

The screen that started this change. Do it before the bulk sweeps so the English tone is set on the page you will look at most.

**Files:**
- Modify: `app/pages/portal/parents.vue`

**Interfaces:** none.

Full string mapping for this file:

| Line | Malay | English |
|---|---|---|
| 95 | `Portal Ibu Bapa` | `Parent portal` |
| 106 | `Ibu kepada {{ student.first }}` | `Parent of {{ student.first }}` |
| 122 | `← Keluar` | `← Sign out` |
| 135 | `Pratonton · Portal Ibu Bapa` | `Preview · Parent portal` |
| 142 | `Selamat datang, {{ guardian?.name }} 👋` | `Welcome, {{ guardian?.name }} 👋` |
| 145 | `Lihat perkembangan {{ student.first }} dengan tenang, semuanya di satu tempat ✨` | `Follow {{ student.first }}'s progress calmly, all in one place ✨` |
| 172 | `'Pelajar ' + student.enrol` | `'Student ' + student.enrol` |
| 190 | `Cawangan` | `Branch` |
| 201 | `Subjek` | `Subjects` |
| 212 | `Yuran Bulanan` | `Monthly fee` |
| 229 | `📅 Jadual Kelas` | `📅 Class schedule` |
| 270 | `💳 Peringatan Bayaran` | `💳 Payment reminder` |
| 273-274 | `Yuran bulan Jun ialah {{ fee }}. Tarikh akhir bayaran: <strong>30 Jun 2026</strong>. Terima kasih kerana sentiasa menyokong {{ student.first }}.` | `June's fee is {{ fee }}. Payment due by <strong>30 June 2026</strong>. Thank you for supporting {{ student.first }}.` |
| 276 | `Bayar sekarang` | `Pay now` |
| 288 | `📣 Pengumuman` | `📣 Announcement` |
| 291-292 | `Cuti penggal bermula 5 Julai. Kelas ulang kaji peperiksaan akan dibuka minggu hadapan, tempat terhad. Hubungi kami untuk tempah tempat {{ student.first }}.` | `Term break starts 5 July. Exam revision classes open next week, places are limited. Contact us to reserve a place for {{ student.first }}.` |
| 296 | `Hubungi kami` | `Contact us` |

Sentence case throughout, per Global Constraints: `Monthly fee`, not `Monthly Fee`.

Also update the comment on line 29 (`Strip the honorific...`) only if it names a Malay UI string. The honorific regex `/^(Puan|Encik|Cik|Tuan)\s+/` **stays** — those are person-name honorifics, and `Puan Aisyah` is seed data.

- [ ] **Step 1: Apply the mapping**

- [ ] **Step 2: Verify in the browser**

Run `npm run dev`, load `/portal/parents`.

Expected: no Malay chrome. Subject chips still read `Matematik · Sains · BI`. Student level still reads `Tahun 4`. Guardian still reads `Puan Aisyah`. Fee renders as `RM 240`.

- [ ] **Step 3: Commit**

```bash
git add app/pages/portal/parents.vue
git commit -m "copy: English parent portal"
```

---

### Task 7: Marketing copy

**Files:** modify each of
`app/components/marketing/Hero.vue`, `TrustStrip.vue`, `SubjectGrid.vue`, `BranchGrid.vue`, `HowToSteps.vue`, `Testimonials.vue`, `WhyChooseUs.vue`, `CtaBanner.vue`, `SiteHeader.vue`, `SiteFooter.vue`, `LoginDropdown.vue`, `Stepper.vue`, `RegistrationWizard.vue`, and `app/pages/register.vue`.

**Interfaces:** none.

Apply the Global Constraints translation policy to every user-visible string. Specific calls:

- `LoginDropdown.vue:27` — `title: 'Portal Ibu Bapa'` → `'Parent portal'`; `sub: 'Lihat info & jadual anak'` → `"See your child's info and schedule"`.
- `Testimonials.vue` — testimonial **quotes** are seeded human content. Translate them to English (a buyer must read them) but keep the reviewer names Malaysian.
- `SubjectGrid.vue` — subject **names** stay Malay. Surrounding chrome ("Subjects we teach") is English.
- `BranchGrid.vue` — branch names stay. `hours` now arrives pre-translated from Task 5; do not re-translate in the component.
- `RegistrationWizard.vue` and `Stepper.vue` — form labels, step titles, validation messages, and button text all become English. `app/utils/validation.ts` has no Malay strings; confirm with `grep -n "'" app/utils/validation.ts` before assuming.

- [ ] **Step 1: Sweep the files above**

- [ ] **Step 2: Verify**

Run `npm run typecheck && npm test`, then `npm run dev` and walk `/` top to bottom, then `/register` through every wizard step.

Expected: no Malay chrome. `test/utils/validation.spec.ts` passes unmodified.

- [ ] **Step 3: Commit**

```bash
git add app/components/marketing/ app/pages/register.vue
git commit -m "copy: English marketing page and registration wizard"
```

---

### Task 8: Tutor portal copy

**Files:** modify
`app/pages/tutor/index.vue`, `schedule.vue`, `lesson-plans.vue`, `earnings.vue`, `classes/index.vue`, `classes/[id].vue`, and `app/components/tutor/TodayClasses.vue`, `EarningsHero.vue`, `AttendanceSegmented.vue`, `ClassCard.vue`, `PlansThisWeek.vue`, `AttendanceRoster.vue`.

**Interfaces:** none.

- `app/pages/tutor/index.vue:26` — the `sub: 'Kelas hari ini'` deferred from Task 1 becomes `sub: 'Classes today'`. Check whether the `sub` field is now redundant with `label`; if the two would read identically, drop `sub` rather than duplicating the string.
- `AttendanceSegmented.vue` and `AttendanceRoster.vue` — status words map `hadir` → `present`, `lewat` → `late`, `tidak hadir` → `absent`. The underlying status **keys** in `useAttendance` are already English (`'present' | 'late' | 'absent'`); only labels change. Do not rename the keys — `test/composables/attendance.spec.ts` asserts on them.

- [ ] **Step 1: Sweep the files above**

- [ ] **Step 2: Verify**

Run `npm run typecheck && npm test`, then `npm run dev` and load every tutor route.

Expected: `/tutor` shows a non-zero "Classes today" and the correct weekday in the greeting. `/tutor/schedule` renders populated columns headed `Mon` through `Sat`. Attendance segmented control still tallies correctly.

- [ ] **Step 3: Commit**

```bash
git add app/pages/tutor/ app/components/tutor/
git commit -m "copy: English tutor portal"
```

---

### Task 9: Admin portal, shared UI, and notifications

**Files:** modify
`app/pages/admin/index.vue`, `students/index.vue`, `students/[id].vue`, `educators/index.vue`, `educators/[id].vue`, `schedule.vue`, `syllabus.vue`, `billing.vue`, `payroll.vue`, `branches.vue`, `settings.vue`, and `app/components/admin/LessonPlanCards.vue`, `RevenueHero.vue`, `OutstandingList.vue`, `ScheduleToday.vue`, `AssignClassModal.vue`, `PaymentHistory.vue`, and `app/components/ui/NotificationDropdown.vue`, `PortalShell.vue`, and `app/composables/useNotifications.ts`.

**Interfaces:** none.

- `useNotifications.ts:78` — `'Lesson plan Bab 4 perlu dihantar sebelum Jumaat.'` → `'Lesson plan Bab 4 is due before Friday.'` Keep `Bab 4`; it is a syllabus chapter reference, domain fact.
- `useNotifications.ts:105` — `'Kehadiran kelas Sabtu berjaya disimpan.'` → `'Saturday class attendance saved.'`
- `ScheduleToday.vue:30` renders `r.ampm`, already English after Task 1. Do not add a translation layer in the component.
- Admin `syllabus.vue` — KPM stage names (`Sekolah Rendah`, `Menengah Rendah`, `Menengah Atas`) and topic names are curriculum proper nouns. **They stay Malay.** Only the surrounding chrome translates.

- [ ] **Step 1: Sweep the files above**

- [ ] **Step 2: Verify**

Run `npm run typecheck && npm test`, then `npm run dev` and load all nine admin routes.

Expected: `/admin` schedule card shows `AFTERNOON` / `EVENING`. `/admin/syllabus` still shows Malay stage and topic names under English headings. Notification dropdown reads English.

- [ ] **Step 3: Commit**

```bash
git add app/pages/admin/ app/components/admin/ app/components/ui/ app/composables/useNotifications.ts
git commit -m "copy: English admin portal, shared UI, and notifications"
```

---

### Task 10: Documentation

**Files:**
- Modify: `CLAUDE.md`
- Modify: `docs/superpowers/PROJECT-CONTEXT.md:270,288,387`

Leave `docs/superpowers/plans/2026-06-28-*.md` and `docs/superpowers/specs/2026-06-28-*.md` untouched. They are historical records of completed work; rewriting them falsifies the archive.

- [ ] **Step 1: Update `CLAUDE.md` copy conventions**

Replace the bilingual bullet. It now contradicts the code, and a future session that reads it will reintroduce Malay sub-labels.

```markdown
## Copy conventions
- Sentence case everywhere. No title case headers.
- No em dashes. Use commas, periods, or "to" for word ranges ("Mon to Sat").
  En-dashes are allowed as numeric range glyphs ("3PM–9PM").
- English throughout the UI. No Malay sub-labels.
- Malaysian domain data stays in Malay: subject names, school levels (Tahun, Tingkatan), class names, person names, branch names.
- Warm, non-corporate tone. Tagline: "Simple, effortless, human."
```

The en-dash carve-out is not cosmetic. Without it, `CLAUDE.md` forbids the exact `hours` string Task 5 writes, and every future session reading `CLAUDE.md` would "fix" it back.

- [ ] **Step 2: Update `PROJECT-CONTEXT.md`**

Three references to `portal/ibubapa.vue` become `portal/parents.vue`, at lines 270, 288, and 387.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md docs/superpowers/PROJECT-CONTEXT.md
git commit -m "docs: English-primary copy conventions and renamed parent route"
```

---

### Task 11: Final verification and pull request

- [ ] **Step 1: Both greps must return nothing**

```bash
grep -rniE 'ibubapa|ibu bapa|daftar|jadual|kelas|pendapatan|rancangan' app/ config/
```

```bash
grep -rnE 'Isnin|Selasa|Rabu|Khamis|Jumaat|Sabtu|Ahad|PETANG|MALAM|Selamat|Januari|Februari|Mac|Mei|Julai|Ogos|Oktober|Disember' app/ config/
```

The second is case-sensitive on purpose. Expect one hit you must **not** act on: `Mei Yi`, a student in `app/stores/academy.ts`. Inspect every hit; delete none blindly.

- [ ] **Step 2: Full gate**

Run: `npm run typecheck && npm test && npm run build`

Expected: all clean. `test/utils/validation.spec.ts` unmodified throughout.

- [ ] **Step 3: Drive the app**

Run `npm run dev` and confirm the four silent-failure surfaces from the spec:

1. `/tutor` shows a non-zero "Classes today".
2. `/tutor/schedule` renders populated columns, `Mon` first.
3. The greeting names the correct weekday for today's real date.
4. `/portal/parents`, `/register`, and all four renamed tutor routes load; the marketing footer and login dropdown have no dead links.

- [ ] **Step 4: Push the branch and the preservation tag**

```bash
git push -u origin feat/english-primary-routes-and-copy
git push origin hz-academy-malay-demo
```

The tag push is not optional. It is the only thing preserving the Hz Academy Malay demo once `main` moves forward.

- [ ] **Step 5: Open the PR**

```bash
gh pr create --title "English-primary routes and copy" --body "$(cat <<'EOF'
## Summary

Makes English the primary language of the mockup: English URL paths, English UI copy, no Malay sub-labels. Groundwork for the Hz Academy to SaaS rebrand, which is deliberately **not** in this PR. `config/academy.ts` still reads `name: 'Hz Academy'`.

## The load-bearing change

`Class.day` was typed `string`, and four sites compared it against the literal `'Isnin'`. Renaming the seed values alone would have left all four compiling and matching nothing: "Classes today: 0", blank schedule columns, no error. Narrowing `day` to a `Day` union turned those into compile errors. Two new tests guard the surfaces that fail silently.

## What did not change

Malaysian domain data is untouched: subject names (`Matematik`), school levels (`Tingkatan 3`), class names (`Tahun 4 Bestari`), person names (`Puan Aisyah`), branch names. `test/utils/validation.spec.ts` asserts on `'Matematik'` and passes unmodified, which is the canary for that boundary.

## Preservation

The pre-pivot state is tagged `hz-academy-malay-demo` (`c54e44f`), pushed with this branch. `git checkout hz-academy-malay-demo` restores the Malay demo in full.

## Verification

- `npm run typecheck`, `npm test`, `npm run build` all clean
- Both residual-Malay greps return nothing (except the known `Mei Yi` student name)
- Drove every route; tutor dashboard and schedule grid render populated

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-review

**Spec coverage.** Section 1 (`Day` union) → Task 1. Section 2 (routes) → Task 3. Section 3 (translation policy) → Tasks 1, 2, 5, 6, 7, 8, 9. Section 4 (`NavItem`) → Task 4. Section 5 (docs) → Task 10. Verification → Task 11. Delivery and tag push → Task 11 Step 4. No gaps.

**Placeholders.** None. Every code step shows code; every file list is enumerated rather than described as "the rest."

**Type consistency.** `Day` is defined once in Task 1 and imported by Task 2's `useGreeting`. `Ampm` is defined in Task 1 and consumed by `AgendaRow` in the same task. `NavItem` gains `label` in Task 4, after Task 3 has settled the `to:` paths it holds, so the two never conflict.

**Known trap, deliberately left in.** Task 11's second grep matches `Mei Yi`. Suppressing it with a narrower pattern would risk hiding a real `Mei` month string. A false positive an engineer must read is safer than a false negative they never see.
