# Hz Academy hi-fi prototype — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clickable, no-backend, pixel-faithful Nuxt 4 mockup of the Hz Academy tuition-centre platform — marketing site + 6-step registration + parent teaser, full Admin portal, full Tutor portal — wired interactive where the brief marks a screen HERO.

**Architecture:** One seeded Pinia store is the only data source; every component reads it through typed composables (the "data seam"), never directly. Visual components are custom-built against an OKLCH `@theme` token set so we match the prototypes exactly; @nuxt/ui v4 supplies only heavy primitives (modal/overlay, inputs). Portals use real nested Nuxt routes; master-detail is a route param. Pure logic (payroll derivation, attendance counts, validation, money formatting) is unit-tested with Vitest; visual fidelity is verified against the `.dc.html` prototypes.

**Tech Stack:** Nuxt 4, Vue 3 `<script setup lang="ts">`, TypeScript strict, Tailwind v4 (CSS-first `@theme`), @nuxt/ui v4, Pinia, Vitest, GSAP + Lenis (marketing only), fonts Fredoka + Plus Jakarta Sans.

## Global Constraints

- Nuxt 4 with `app/` directory; SPA/static rendering, `ssr: false`, no server routes.
- TypeScript strict. Vue SFCs use `<script setup lang="ts">`.
- **Data seam is absolute:** no component imports the Pinia store or seed arrays directly. Data only via composables in `app/composables/`. Each composable carries the comment: `// swap internals for API calls when backend lands; signature stays stable`.
- **Stay generic:** every Hz-specific value (name, tagline, contact, branches, logo) comes from `config/academy.ts`. No "Hz" string literal anywhere else.
- **Money with care:** all pay/earnings are *derived* from `Session[]` (`sum(durationHours) × rate`), never hand-entered. Format `RM ${n.toLocaleString('en-MY')}`. No live calc wired to user inputs.
- **Payroll invariant:** Cikgu Hafiz = 38h × RM 45 = **RM 1,710** must reconcile on the tutor dashboard, tutor Pendapatan, admin Educators column, and admin Payroll, all recomputed from the same sessions.
- **Copy:** sentence case, no em dashes (use commas/periods/"to"), warm non-corporate tone, tagline "Simple, effortless, human." Reproduce each prototype's bilingual pattern verbatim (admin English-over-Malay, tutor Malay-over-English, marketing BM-primary).
- **Tokens only:** no fonts or hues beyond `config/academy.ts` + `main.css`. Emoji kept as icons.
- Source of truth for pixels + copy + data: `/Users/BHQIMBP16/Developer/design_handoff_hz_academy/*.dc.html` (read the `<x-dc>` template for layout, the `<script type="text/x-dc">` `renderVals()` for data/handlers). Do **not** port `support.js`.
- Marketing motion (GSAP/Lenis) marketing page only. Dashboards: no animation.
- Commit after every task. No Claude attribution in commit messages.

---

## Phase A — Foundation (sequential; everything depends on it)

### Task 1: Scaffold project + tooling

**Files:**
- Create: `package.json`, `nuxt.config.ts`, `tsconfig.json`, `app/app.vue`, `vitest.config.ts`, `app/assets/css/main.css` (stub), `.gitignore`
- Create: `test/setup.ts`

**Interfaces:**
- Produces: a booting Nuxt 4 app with Pinia, @nuxt/ui v4, @nuxt/fonts, Tailwind v4, and Vitest available to all later tasks.

- [ ] **Step 1: Initialise Nuxt 4 + deps**

```bash
cd /Users/BHQIMBP16/Developer/academy-platform
npx nuxi@latest init . --packageManager npm --no-gitInit --force
npm i pinia @pinia/nuxt @nuxt/ui @nuxt/fonts
npm i -D vitest @vue/test-utils @nuxt/test-utils happy-dom
```
(@nuxt/ui v4 brings Tailwind v4. `--force` because the repo already has README/docs/.git.)

- [ ] **Step 2: Configure Nuxt** — `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  ssr: false,
  modules: ['@nuxt/ui', '@nuxt/fonts', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  typescript: { strict: true },
  fonts: {
    families: [
      { name: 'Plus Jakarta Sans', provider: 'google', weights: [400, 500, 600, 700, 800] },
      { name: 'Fredoka', provider: 'google', weights: [400, 500, 600, 700] },
    ],
  },
  app: { head: { htmlAttrs: { lang: 'ms' } } },
})
```

- [ ] **Step 3: Vitest config** — `vitest.config.ts`:

```ts
import { defineVitestConfig } from '@nuxt/test-utils/config'
export default defineVitestConfig({
  test: { environment: 'happy-dom', globals: true, setupFiles: ['./test/setup.ts'] },
})
```
`test/setup.ts`: `import { setActivePinia, createPinia } from 'pinia'; beforeEach(() => setActivePinia(createPinia()))`

- [ ] **Step 4: Minimal `app/app.vue`** rendering `<NuxtLayout><NuxtPage /></NuxtLayout>`, and a stub `main.css` with `@import "tailwindcss";` + `@import "@nuxt/ui";`.

- [ ] **Step 5: Verify boot**

Run: `npm run dev` (then stop). Expected: dev server starts with no errors, blank page renders.
Run: `npx vitest run` Expected: "No test files found" exits 0.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: scaffold Nuxt 4 + pinia + nuxt/ui + vitest"
```

---

### Task 2: Academy config (the theming seam)

**Files:**
- Create: `config/academy.ts`
- Create: `app/types/academy.ts`

**Interfaces:**
- Produces: `academy: Academy` default export; type `Academy { name, tagline, motto, contact: { whatsapp, phone, email, web }, branches: Branch[], logoText }`. `Branch { id, name, short, hours }`. Branches: Kota Warisan Sepang, Taman Sutera Kajang, Taman Ixora, Pekan. Consumed by `useAcademy` and every shell.

- [ ] **Step 1:** Write `app/types/academy.ts` with the `Academy` + `Branch` interfaces above.
- [ ] **Step 2:** Write `config/academy.ts`:

```ts
import type { Academy } from '~/types/academy'
export const academy: Academy = {
  name: 'Hz Academy',
  tagline: 'Dipercayai sejak 2014',
  motto: 'Simple, effortless, human.',
  logoText: 'Hz',
  contact: { whatsapp: '+60123456789', phone: '03-1234 5678', email: 'hello@hzacademy.my', web: 'axelnovaventures.com' },
  branches: [
    { id: 'kw', name: 'Kota Warisan Sepang', short: 'Kota Warisan', hours: 'Isnin to Sabtu, 3pm to 9pm' },
    { id: 'sk', name: 'Taman Sutera Kajang', short: 'Kajang', hours: 'Isnin to Sabtu, 3pm to 9pm' },
    { id: 'ix', name: 'Taman Ixora', short: 'Ixora', hours: 'Isnin to Sabtu, 3pm to 9pm' },
    { id: 'pk', name: 'Pekan', short: 'Pekan', hours: 'Isnin to Sabtu, 3pm to 9pm' },
  ],
}
```
(Branch hours/contact: confirm against marketing prototype Cawangan section; adjust copy to match.)

- [ ] **Step 3:** Commit `chore: add academy config and branding seam`.

---

### Task 3: Theme tokens, fonts, keyframes (`main.css`)

**Files:**
- Modify: `app/assets/css/main.css`

**Interfaces:**
- Produces: CSS custom properties / Tailwind theme utilities for every token in the spec, usable as `bg-surface`, `text-ink`, `border-border`, `rounded-card`, plus raw vars (`var(--brand)`) for gradients. Keyframes `hzfloat`, `hzfloat2`, `hzpop`. `::selection` `#FFD3E2`.

- [ ] **Step 1:** Author `@theme` block converting the palette to OKLCH with semantic names exactly per the spec's "Design tokens" (brand, brand-deep, accent-pink/orange/blue; ink/ink-footer/text-body/ink-soft/muted/faint/faintest/disabled; bg-app/surface/surface-subtle/surface-lavender; border/border-marketing/border-input/divider; the 8 subject tile bg+fg pairs; the 5 status bg+fg pairs; whatsapp). Radius scale: `--radius-pill: 999px`, `--radius-card: 20px`, `--radius-btn: 13px`, `--radius-tile: 13px`. Set `--font-sans: 'Plus Jakarta Sans'`, `--font-display: 'Fredoka'`.
- [ ] **Step 2:** Add the brand gradient as a var: `--brand-gradient: linear-gradient(135deg,#8B6CF0,#FF7AA8 60%,#FFA94D)`. Add the keyframes (`hzfloat`, `hzfloat2`, `hzpop`) and shadow vars per spec. Global: body `font-family: var(--font-sans)`, `-webkit-font-smoothing: antialiased`, `background: var(--bg-app)`. `::selection { background:#FFD3E2 }`. Add `@media (prefers-reduced-motion: reduce)` zeroing the keyframe animations.
- [ ] **Step 3: Verify** — temporary swatch page or devtools confirms `bg-brand`, `text-ink`, `rounded-card`, and a `--brand-gradient` element render the right colors. Remove the temp.
- [ ] **Step 4:** Commit `feat: add OKLCH theme tokens, fonts, keyframes`.

---

### Task 4: Entity types

**Files:**
- Create: `app/types/index.ts` (re-exports `academy.ts` + the entities below)

**Interfaces:**
- Produces (exact names later tasks rely on):
```ts
export type Stage = 'rendah' | 'mr' | 'ma'
export interface Subject { name: string; short: string; icon: string; bg: string; tile: string; stage: Stage[] }
export interface Guardian { id: string; name: string; phone: string; studentIds: string[] }
export interface Student { id: string; name: string; first: string; level: string; branchId: string; subjects: string[]; enrol: 'Aktif' | 'Percubaan' | 'Tidak aktif'; pay: 'Paid' | 'Pending' | 'Overdue'; guardianId: string; attendancePct: number }
export interface Educator { id: string; name: string; subjects: string[]; branches: string; branchIds: string[]; rate: number; hours: number }
export interface Class { id: string; subject: string; cls: string; level: string; day: string; time: string; ampm: string; branchId: string; dur: number; educatorId: string; attendPct: number; roster: string[] }
export interface Session { id: string; classId: string; educatorId: string; date: string; durationHours: number }
export interface Invoice { id: string; studentId: string; name: string; branchId: string; amount: number; status: 'Paid' | 'Pending' | 'Overdue'; proof: boolean; period: string }
export interface LessonPlan { id: string; classId: string; cls: string; week: string; topic: string; ref: string; material: string | null; attached: boolean }
export interface Enquiry { id: string; name: string; ago: string; detail: string; source: 'Facebook' | 'TikTok' | 'Google Ads'; status: 'new' | 'pending' | 'week' }
export interface PayrollRun { educatorId: string; period: string; hours: number; rate: number; amount: number }
export interface Feedback { id: string; studentId: string; classId: string; note: string; date: string }
export type AttendanceStatus = 'present' | 'late' | 'absent'
export interface ScheduleCell { classId: string; subject: string; cls: string; tutor: string; branch: string; bg: string; fg: string }
```

- [ ] **Step 1:** Write the interfaces above into `app/types/index.ts`.
- [ ] **Step 2:** Run `npx vue-tsc --noEmit` (or `npx nuxi typecheck`). Expected: passes.
- [ ] **Step 3:** Commit `feat: add domain entity types`.

---

### Task 5: Seeded store + payroll invariant (TDD)

**Files:**
- Create: `app/stores/academy.ts`
- Test: `test/store/payroll.spec.ts`

**Interfaces:**
- Consumes: types from Task 4, `academy` from Task 2.
- Produces: `useAcademyStore()` Pinia store exposing readonly arrays `subjects, guardians, students, educators, classes, sessions, invoices, lessonPlans, enquiries, feedback` and the persona id `tutorSelfId` (Cikgu Hafiz). Data is internally consistent.

- [ ] **Step 1: Write the failing test** — `test/store/payroll.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { useAcademyStore } from '~/stores/academy'

describe('seeded payroll consistency', () => {
  it('Cikgu Hafiz has 38 recorded hours at RM45 = RM1710', () => {
    const s = useAcademyStore()
    const hafiz = s.educators.find(e => e.id === s.tutorSelfId)!
    const hours = s.sessions.filter(x => x.educatorId === hafiz.id)
      .reduce((t, x) => t + x.durationHours, 0)
    expect(hours).toBe(38)
    expect(hafiz.rate).toBe(45)
    expect(hours * hafiz.rate).toBe(1710)
  })
  it('every class educator and student exists', () => {
    const s = useAcademyStore()
    for (const c of s.classes) {
      expect(s.educators.some(e => e.id === c.educatorId)).toBe(true)
    }
  })
})
```

- [ ] **Step 2: Run, verify it fails** — `npx vitest run test/store/payroll.spec.ts` → FAIL (store not defined).
- [ ] **Step 3: Implement the store.** Seed realistic Malaysian data from the prototypes' `renderVals()`:
  - **Subjects** (9, with short/icon/bg/tile/stage): Matematik (Mat, 📐, pink), Bahasa Inggeris (BI, 🔤, blue), Sains (Sn, 🔬, violet), Bahasa Melayu (BM, 📖, green), Sejarah (Sej, 📜, amber), Geografi (Geo, 🌏, orange), plus a STEM (🤖, indigo) and a TVET (🛠️, rose) example, and one more to reach 9 per the marketing Subjek grid.
  - **Branches** referenced by id from `academy.branches`.
  - **Educators**: include Cikgu Hafiz (`tutorSelfId`, Matematik, branchIds [kw, sk], rate 45, hours 38) plus ~5 others with varied rates/hours. `branches` string is a human label like "Kota Warisan, Kajang".
  - **Sessions**: generate enough per educator that `sum(durationHours)=hours`. For Hafiz: sessions summing to exactly 38 (e.g. weekly 1.5h/2h classes across the month). For others, sum to their `hours`.
  - **Students**: ~24 for Hafiz's classes plus enough for admin (target 342 active is a metric, not 342 rows — seed ~30 representative students; the dashboard count is a computed/declared metric in `useAdminMetrics`). Mix enrol + pay statuses, real-format names, levels (Tahun 1 to Tingkatan 5), guardianId.
  - **Guardians**: one per student family, Malaysian `01X-XXX XXXX` phones.
  - **Classes**: Hafiz's 4 Matematik classes (the tutor portal needs these exact: days/times 3:00 PM, 4:30 PM, 5:00 PM, 7:30 PM, branches Kota Warisan/Kajang, rosters) + others for the admin schedule grid.
  - **Invoices**: across Paid/Pending/Overdue with `proof` bools and periods, to feed Billing + the RM 2,160 outstanding metric.
  - **LessonPlans**: 4 for Hafiz's classes (week, topic, KPM ref, material|null).
  - **Enquiries**: ~4 leads with sources Facebook/TikTok/Google Ads and statuses.
  - Expose `tutorSelfId = 'hafiz'`. Return everything `readonly`.
- [ ] **Step 4: Run, verify pass** — `npx vitest run test/store/payroll.spec.ts` → PASS (both tests).
- [ ] **Step 5:** Commit `feat: seed academy store with reconciling payroll data`.

---

### Task 6: Composable data seam + derivation tests (TDD)

**Files:**
- Create: `app/composables/useAcademy.ts`, `useStudents.ts`, `useGuardians.ts`, `useEducators.ts`, `useSubjects.ts`, `useClasses.ts`, `useLessonPlans.ts`, `useSchedule.ts`, `useAttendance.ts`, `usePayroll.ts`, `useBilling.ts`, `useFeedback.ts`, `useEnquiries.ts`, `useAdminMetrics.ts`
- Create: `app/utils/money.ts` (`formatRM(n: number): string`)
- Test: `test/composables/payroll.spec.ts`, `test/utils/money.spec.ts`

**Interfaces:**
- Consumes: store (Task 5), types (Task 4).
- Produces (signatures later tasks call):
```ts
useAcademy(): { academy: Academy }
useStudents(): { all: Student[]; byId(id): Student | undefined; filter(q): Student[] }
useEducators(): { all: Educator[]; byId(id); estimatedPay(id): number }
useClasses(): { all: Class[]; byId(id); forEducator(id): Class[] }
useSchedule(): { grid(opts?: { educatorId? }): ScheduleCell[][]; days: string[]; times: string[] }
useAttendance(): { state: Ref<Record<string, AttendanceStatus>>; set(key, s): void; statusOf(classId, student): AttendanceStatus; counts(classId, roster): { present, late, absent }; reset(): void }
usePayroll(): { runFor(educatorId, period): PayrollRun; weeklyBreakdown(id): number[]; byClass(id): { classId, hours, amount }[] }
useBilling(): { all: Invoice[]; filter(f): Invoice[]; summary(): { paid, pending, overdue } }
useLessonPlans(): { all: LessonPlan[]; forEducator(id): LessonPlan[]; forClass(classId): LessonPlan[] }
useEnquiries(): { all: Enquiry[]; filter(f): Enquiry[] }
useAdminMetrics(): { enquiries, activeStudents, classesToday, outstanding, revenue, cost, margin, marginPct }
```
`formatRM(1710) === 'RM 1,710'`. `estimatedPay` and `usePayroll.runFor` both = `sum(sessions.durationHours) × rate`.

- [ ] **Step 1: Failing tests** — `test/utils/money.spec.ts` asserts `formatRM(1710)==='RM 1,710'`, `formatRM(40680)==='RM 40,680'`, `formatRM(0)==='RM 0'`. `test/composables/payroll.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { useEducators } from '~/composables/useEducators'
import { usePayroll } from '~/composables/usePayroll'
import { useAcademyStore } from '~/stores/academy'

it('estimatedPay equals payroll run equals 1710 for Hafiz', () => {
  const id = useAcademyStore().tutorSelfId
  const pay = useEducators().estimatedPay(id)
  const run = usePayroll().runFor(id, 'Jun 2026')
  expect(pay).toBe(1710)
  expect(run.amount).toBe(1710)
  expect(run.amount).toBe(pay)
})
```

- [ ] **Step 2: Run, verify fail** — `npx vitest run test/composables test/utils` → FAIL.
- [ ] **Step 3: Implement** `formatRM` and all composables. Each: thin wrapper over the store, the stability comment, typed return. `estimatedPay`/`runFor` derive from sessions. `useAdminMetrics` declares/computes the dashboard numbers (enquiries 18, activeStudents 342, classesToday 9, outstanding 2160, revenue/cost so margin = RM 40,680 at 49.6%) — derive `outstanding` from unpaid invoices where possible, declare the headline aggregates as documented metric constants if the seed slice is smaller than the displayed totals.
- [ ] **Step 4: Run, verify pass** — `npx vitest run test/composables test/utils` → PASS.
- [ ] **Step 5:** Commit `feat: add composable data seam with derived payroll + metrics`.

---

### Task 7: Shared UI components

**Files:**
- Create under `app/components/ui/`: `StatCard.vue`, `StatusPill.vue`, `SubjectChip.vue`, `IconTile.vue`, `DataTable.vue`, `GradientButton.vue`, `DarkButton.vue`, `GreenButton.vue`, `SectionHeading.vue`, `EmptyState.vue`, `DemoWatermark.vue`, `LogoMark.vue`
- Create: `app/utils/status.ts` (status → {bg,fg} maps: `SB` enquiry, `PAY` payment, `ENROL` enrolment, `ATT` attendance), `app/utils/subjects.ts` (subject name → tile pair via store)

**Interfaces:**
- Produces reusable props-driven components consumed by every screen. Exact prop shapes:
  - `StatCard { icon, tileKey, value, label, sub, delta?, deltaTone? }`
  - `StatusPill { kind: 'pay'|'enrol'|'att'|'enquiry', value: string }`
  - `SubjectChip { subject: string, size?: 'sm'|'full' }`
  - `IconTile { icon, tileKey, size }`
  - `DataTable { columns: {key,label,align?}[], rows: any[] }` with `#cell-<key>` slots; includes the `.hz-scroll` wrapper.
  - `GradientButton/DarkButton/GreenButton { as?, to? }` + default slot.
  - `EmptyState { icon, title, desc }` (the dashed-stripe "sedang dibina" tile).
  - `DemoWatermark` (fixed bottom-left `<a>` to `academy.contact.web`).
  - `LogoMark { size? }` (CSS gradient square + Fredoka `academy.logoText`).

- [ ] **Step 1:** Build the status/subject util maps from the spec's token table.
- [ ] **Step 2:** Build each component with exact styles from the spec's "Shared components" section (StatCard radius 18 pad 18; StatusPill `5px 11px` radius 999 11px/700; pills/tiles per token table). Use tokens, not literal hex, where a token exists.
- [ ] **Step 3: Verify** — a scratch `/playground` page renders one of each; compare to the prototype's reusable bits. Delete the scratch page after.
- [ ] **Step 4:** Commit `feat: add shared UI component kit`.

---

### Task 8: Layouts, portal shells, routing skeleton, fake auth

**Files:**
- Create: `app/layouts/marketing.vue`, `app/layouts/admin.vue`, `app/layouts/tutor.vue`
- Create: `app/components/admin/AdminSidebar.vue`, `AdminTopbar.vue`; `app/components/tutor/TutorSidebar.vue`, `TutorTopbar.vue`; `app/components/marketing/SiteHeader.vue`, `LoginDropdown.vue`, `SiteFooter.vue`
- Create placeholder pages: `app/pages/index.vue`, `daftar.vue`, `portal/ibubapa.vue`, `admin/index.vue` + the 8 other admin routes, `tutor/index.vue` + the 4 other tutor routes (each a titled themed placeholder for now)
- Copy: `CLAUDE.md` from handoff to repo root

**Interfaces:**
- Consumes: `useAcademy`, `ui/` components. Produces: working navigation across all four portals; nav config arrays `adminNav` (9) and `tutorNav` (5) with `{ to, en, ms, icon }`; active state by `useRoute().path`. Sidebars collapse to sticky horizontal nav under `md`.

- [ ] **Step 1:** Copy `CLAUDE.md`: `cp "/Users/BHQIMBP16/Developer/design_handoff_hz_academy/Claude Prompt/CLAUDE.md" CLAUDE.md`.
- [ ] **Step 2:** Build `admin.vue` layout = sidebar + topbar + content (max-w 1280, pad `28px 30px 60px`) + `DemoWatermark`. Build `AdminSidebar` (248px, logo row, PENGURUSAN label, 9 nav items with violet active, profile chip "Admin Hz / Kota Warisan", "← Keluar ke laman web" → `/`). `AdminTopbar` (route title, search box, 🔔 with pink dot, gradient avatar). Mirror for tutor (`RUANG TUTOR`, 5 items, "Cikgu Hafiz / Matematik · 2 cawangan", pink "H" avatar).
- [ ] **Step 3:** Build `marketing.vue` layout = `SiteHeader` (translucent blur, logo, nav pills, `LoginDropdown`, WhatsApp CTA) + slot + `SiteFooter`. `LoginDropdown`: 3 rows → `/admin`, `/tutor`, `/portal/ibubapa`, with `hzpop` animation, open/close state.
- [ ] **Step 4:** Create every page as a placeholder using the layout via `definePageMeta({ layout })` and a titled `EmptyState`-style card.
- [ ] **Step 5: Verify** — `npm run dev`: from `/`, the Log Masuk dropdown reaches `/admin` and `/tutor`; every nav item in both portals routes and shows its title; "Keluar" returns to `/`; direct URL to each route works; responsive collapse works at mobile width.
- [ ] **Step 6:** Commit `feat: add layouts, portal shells, routing, fake auth switcher`.

---

## Phase B — Admin portal (HERO/SUPPORTING/STUB)

> Pixel + copy + data source: `Hz Admin Portal.dc.html`. Read its `renderVals()` for exact arrays, status maps (`SB`/`PAY`/`ENROL`), and handlers. Independent screens (Tasks 10/12/14/15) may be built by parallel subagents.

### Task 9: Admin dashboard (HERO)

**Files:**
- Modify: `app/pages/admin/index.vue`
- Create: `app/components/admin/RevenueHero.vue`, `ScheduleToday.vue`, `EnquiryList.vue`, `OutstandingList.vue`

**Interfaces:**
- Consumes: `useAdminMetrics`, `useSchedule`, `useEnquiries`, `useBilling`, `ui/StatCard`. Produces dashboard at `/admin`.

- [ ] **Step 1:** Greeting H1 (Fredoka 30) + date sub + dark "+ Daftar pelajar baru" button.
- [ ] **Step 2:** 4 stat cards from `useAdminMetrics` (New enquiries 18, Active students 342, Classes today 9, Outstanding RM 2,160).
- [ ] **Step 3:** `RevenueHero` — dark gradient `linear-gradient(135deg,#1E2348,#2D2F66 55%,#3A2F70)`, radius 24, 2 radial blobs, "MARGIN BULAN INI" pill, RM 40,680 (Fredoka 52), "↑ 49.6% margin" pill, stacked bar (49.6% gradient) + Margin/Kos tutor mini cards. All numbers from `useAdminMetrics` via `formatRM`.
- [ ] **Step 4:** Two-column: `ScheduleToday` (5 class rows: time block + colored bar + subject/class chip + tutor·branch) | `EnquiryList` (source pills + filter `all/new/pending/week`, active pill dark) + `OutstandingList` (3 rows).
- [ ] **Step 5: Verify** — visual match to prototype dashboard; filter pills change the enquiry list; numbers reconcile with metrics.
- [ ] **Step 6:** Commit `feat(admin): dashboard with revenue/margin hero`.

### Task 10: Students list + filters (HERO)

**Files:** Modify `app/pages/admin/students/index.vue`. Create `app/components/admin/StudentFilters.vue`.
**Interfaces:** Consumes `useStudents`, `useBilling`, `ui/DataTable`, `StatusPill`, `SubjectChip`. Row click → `navigateTo('/admin/students/'+id)`.
- [ ] **Step 1:** Header + count, search input + 4 filter dropdowns (Cawangan/Tahap/Subjek/Bayaran).
- [ ] **Step 2:** `DataTable` columns: Pelajar (avatar+guardian) / Tahap / Cawangan / Subjek (chips) / Pendaftaran (enrol pill) / Bayaran (pay pill) / action "Lihat →". Filtering wired via `useStudents().filter`.
- [ ] **Step 3: Verify** search + each filter narrows rows; row click routes to detail.
- [ ] **Step 4:** Commit `feat(admin): students list with search and filters`.

### Task 11: Student detail (HERO)

**Files:** Modify `app/pages/admin/students/[id].vue`. Create `app/components/admin/AttendanceDonut.vue`, `app/components/admin/PaymentHistory.vue`, `app/components/admin/GuardianCard.vue`.
**Interfaces:** Consumes `useStudents().byId`, `useClasses`, `useBilling`, `useGuardians`. `AttendanceDonut { pct }` = conic-gradient.
- [ ] **Step 1:** Back link + header card (64px avatar, name, level·branch, enrol pill, pay pill).
- [ ] **Step 2:** Left col: "Subjek & kelas didaftarkan" class rows + "Sejarah bayaran" invoice rows (proof thumbnail, amount, status). Right col: `GuardianCard` (avatar, phone tile, green "💬 WhatsApp penjaga") + "Ringkasan kehadiran" `AttendanceDonut` 92% + Hadir/Tidak hadir/Lewat counts.
- [ ] **Step 3: Verify** detail loads by URL for any student id; donut renders pct; back returns to list.
- [ ] **Step 4:** Commit `feat(admin): student detail panel`.

### Task 12: Educators list + detail (HERO)

**Files:** Modify `app/pages/admin/educators/index.vue`, `educators/[id].vue`. Create `app/components/admin/EducatorHoursBars.vue`.
**Interfaces:** Consumes `useEducators` (incl. `estimatedPay`), `usePayroll` (`weeklyBreakdown`, `byClass`), `useClasses`.
- [ ] **Step 1:** List table: Pendidik / Subjek chips / Cawangan / Kadar per jam / Jam bln ini / Anggaran gaji (green Fredoka = `estimatedPay`). Row → detail.
- [ ] **Step 2:** Detail two-column: profile card (74px avatar, branches, subject pills, KADAR/JAM tiles) + dark "ANGGARAN GAJI" card (rate × hours) | "Kelas ditugaskan" + `EducatorHoursBars` (4 weekly bars + total from `weeklyBreakdown`).
- [ ] **Step 3: Verify** Anggaran gaji in the list equals the dark card in detail equals `estimatedPay`; for Hafiz both = RM 1,710.
- [ ] **Step 4:** Commit `feat(admin): educators list and detail with derived pay`.

### Task 13: Schedule grid + assign-class modal (HERO)

**Files:** Modify `app/pages/admin/schedule.vue`. Create `app/components/admin/ScheduleGrid.vue`, `AssignClassModal.vue`, `app/components/admin/LessonPlanCards.vue`.
**Interfaces:** Consumes `useSchedule().grid()`, `useSubjects`, `useClasses`, `useLessonPlans`. `ScheduleGrid { cells, days, times }`. Modal uses @nuxt/ui `UModal` or custom overlay.
- [ ] **Step 1:** Subject legend row. `ScheduleGrid`: `grid-template-columns:64px repeat(6,1fr)`, 4 time rows, Isnin–Sabtu. Empty cell `#FBFAFE`; filled = subject bg + 3px left border in subject fg, showing subject/class/tutor/branch.
- [ ] **Step 2:** `LessonPlanCards` "Rancangan pengajaran minggu ini".
- [ ] **Step 3:** `AssignClassModal` — overlay `rgba(30,35,72,.42)` blur(3px), 520px card radius 24, 2-col pseudo-selects (Subjek/Kelas/Tutor/Cawangan/Hari) + time-slot chips (selected `#F1ECFF`/`#6B4BD6`/`1.5px solid #C9BCF2`), footer Batal (outline) / Tetapkan kelas ✓ (gradient). "+ Tetapkan kelas" opens it; backdrop + ✕ + both footer buttons close; inner `@click.stop`.
- [ ] **Step 4: Verify** grid matches prototype; modal opens/closes by all paths; slot chips toggle.
- [ ] **Step 5:** Commit `feat(admin): schedule grid and assign-class modal`.

### Task 14: Billing (HERO)

**Files:** Modify `app/pages/admin/billing.vue`. Create `app/components/admin/ProofThumb.vue`.
**Interfaces:** Consumes `useBilling` (`filter`, `summary`).
- [ ] **Step 1:** 3 summary cards (Sudah bayar green / Pending amber / Overdue red) from `summary()`.
- [ ] **Step 2:** Filter pills (Semua/Sudah bayar/Pending/Overdue) + invoice table: Pelajar / Tempoh / Jumlah / Bukti bayaran (`ProofThumb` striped or "— Belum ada") / Status / action ("✓ Tandakan dibayar" or "Lihat resit").
- [ ] **Step 3: Verify** filter narrows; summary totals equal the filtered sums.
- [ ] **Step 4:** Commit `feat(admin): billing table with proof tracking`.

### Task 15: Syllabus (SUPPORTING)

**Files:** Modify `app/pages/admin/syllabus.vue`. Create `app/components/admin/SyllabusBank.vue`.
**Interfaces:** Consumes `useSubjects`, `useClasses`. State: `stage` (rendah/mr/ma), `subjectSel`.
- [ ] **Step 1:** 3 stage pills (Sekolah Rendah / Menengah Rendah / Menengah Atas, active dark).
- [ ] **Step 2:** Two-column: subject grid (selected border `#C9BCF2`) | selected-subject detail (class list per level + "+ Lampirkan bahan").
- [ ] **Step 3: Verify** stage switch changes the bank; subject select changes the detail.
- [ ] **Step 4:** Commit `feat(admin): syllabus bank`.

### Task 16: Admin stubs (Payroll, Branches, Settings)

**Files:** Modify `app/pages/admin/payroll.vue`, `branches.vue`, `settings.vue`.
**Interfaces:** Consumes `ui/EmptyState`, `ui/StatCard`, `usePayroll`/`useAcademy` for the 3 stat cards each.
- [ ] **Step 1:** Each = header + 3 themed stat cards + centered "sedang dibina" `EmptyState` (dashed-stripe tile, title, description). Branches uses `academy.branches`.
- [ ] **Step 2: Verify** all three render in theme.
- [ ] **Step 3:** Commit `feat(admin): payroll, branches, settings stubs`.

---

## Phase C — Tutor portal (HERO/SUPPORTING)

> Source: `Hz Tutor Portal.dc.html`. Persona Cikgu Hafiz. The attendance detail (Task 19) is the key interactive screen.

### Task 17: Tutor dashboard (HERO)

**Files:** Modify `app/pages/tutor/index.vue`. Create `app/components/tutor/TodayClasses.vue`, `EarningsMini.vue`, `PlansThisWeek.vue`.
**Interfaces:** Consumes `useClasses().forEducator(tutorSelfId)`, `useEducators().estimatedPay`, `usePayroll`, lesson plans.
- [ ] **Step 1:** Greeting "Selamat petang, Cikgu Hafiz 👋" + date + dark "Lihat pendapatan saya →".
- [ ] **Step 2:** 4 stat cards: Classes today 2 (pink), Hours this week 6.5 j (blue), My students 24 (violet), Est. salary RM 1,710 (green, from `estimatedPay`).
- [ ] **Step 3:** Two-column: `TodayClasses` (rows with "Tanda kehadiran →" → `/tutor/kelas/{id}`) | `EarningsMini` (dark card RM 1,710, "Pecahan jam →") + `PlansThisWeek` (3 reminders with Siap/Perlu pills).
- [ ] **Step 4: Verify** est. salary = RM 1,710; "Tanda kehadiran" routes to that class detail.
- [ ] **Step 5:** Commit `feat(tutor): dashboard`.

### Task 18: Jadual Saya (HERO)

**Files:** Modify `app/pages/tutor/jadual.vue`. Reuse `tutor`-scoped `ScheduleGrid` (or shared grid with `educatorId`).
**Interfaces:** Consumes `useSchedule().grid({ educatorId: tutorSelfId })`.
- [ ] **Step 1:** Branch legend (Kota Warisan `#8B6CF0` / Kajang `#FF7AA8`). Weekly grid of Hafiz's 4 Matematik classes; times 3:00/4:30/5:00/7:30 PM. Cells clickable → `/tutor/kelas/{id}`.
- [ ] **Step 2: Verify** only Hafiz's classes show; cell click routes to detail.
- [ ] **Step 3:** Commit `feat(tutor): weekly schedule grid`.

### Task 19: Kelas list + attendance detail (HERO, key interaction) (TDD for logic)

**Files:** Modify `app/pages/tutor/kelas/index.vue`, `kelas/[id].vue`. Create `app/components/tutor/ClassCard.vue`, `AttendanceRoster.vue`, `AttendanceSegmented.vue`. Test: `test/composables/attendance.spec.ts`.
**Interfaces:** Consumes `useClasses`, `useAttendance` (`set`, `statusOf`, `counts` default present, `reset`). `AttendanceSegmented { modelValue: AttendanceStatus, onChange }`.
- [ ] **Step 1: Failing test** — `test/composables/attendance.spec.ts`:

```ts
import { useAttendance } from '~/composables/useAttendance'
it('defaults to present and counts live', () => {
  const a = useAttendance(); a.reset()
  const roster = ['Ali', 'Siti', 'Tan']
  expect(a.counts('c0', roster)).toEqual({ present: 3, late: 0, absent: 0 })
  a.set('c0|Ali', 'absent'); a.set('c0|Siti', 'late')
  expect(a.counts('c0', roster)).toEqual({ present: 1, late: 1, absent: 1 })
})
```

- [ ] **Step 2: Run, verify fail** → FAIL.
- [ ] **Step 3:** Implement/confirm `useAttendance` `counts` + `reset`. Run → PASS.
- [ ] **Step 4:** `kelas/index.vue`: header "4 kelas · 24 pelajar", grid of 4 `ClassCard`s (icon tile + "N pelajar" pill + "Matematik · {class}" + day·time·branch + "Kehadiran purata {%}"). Card → `/tutor/kelas/{id}`.
- [ ] **Step 5:** `kelas/[id].vue`: header card (60px tile + class + meta + count). Attendance card: title + "Sesi {day}, 29 Jun 2026" + live summary pills (✓ Hadir N green / ◐ Lewat N amber / ✕ Tidak hadir N red). `AttendanceRoster` rows: avatar + name + level + `AttendanceSegmented` (3 buttons, default present, active fills status color, inactive white/`#ECEAF4`/`#A8ACC2`). Footer: "Set semula" (outline → reset) + green "Simpan kehadiran" → label flips to "Kehadiran disimpan ✓"; any later change resets saved=false.
- [ ] **Step 6: Verify** counts update live; reset restores all-present; save flips the label; changing after save un-flips it.
- [ ] **Step 7:** Commit `feat(tutor): classes list and interactive attendance`.

### Task 20: Pendapatan (HERO)

**Files:** Modify `app/pages/tutor/pendapatan.vue`. Create `app/components/tutor/EarningsHero.vue`, `WeeklyHoursBars.vue`, `HoursByClass.vue`.
**Interfaces:** Consumes `usePayroll` (`runFor`, `weeklyBreakdown`, `byClass`), `useEducators`.
- [ ] **Step 1:** Header + "⬇ Muat turun slip". `EarningsHero` dark gradient: RM 1,710, "↑ 4 jam dari Mei" pill, "38 jam × RM 45/jam · Dibayar 5 Julai 2026", JAM DIREKOD/KADAR mini cards.
- [ ] **Step 2:** Two-column: `WeeklyHoursBars` (4 bars + total 38j from `weeklyBreakdown`) | `HoursByClass` (4 rows: subject tile + class/branch + hours + RM = hours × 45 from `byClass`).
- [ ] **Step 3: Verify** hero RM 1,710 = sum of `HoursByClass` amounts = dashboard est. salary = admin Educators figure.
- [ ] **Step 4:** Commit `feat(tutor): earnings and payslip screen`.

### Task 21: Rancangan Mengajar (SUPPORTING)

**Files:** Modify `app/pages/tutor/rancangan.vue`. Create `app/components/tutor/LessonPlanCard.vue`.
**Interfaces:** Consumes lesson plans for `tutorSelfId` classes.
- [ ] **Step 1:** Header + "+ Lampiran baru". Grid of 4 cards: class pill + week + topic + "Rujukan KPM: {ref}" + (file chip "📎 {material}.pdf" or dashed "+ Lampirkan bahan").
- [ ] **Step 2: Verify** attached vs unattached states render correctly.
- [ ] **Step 3:** Commit `feat(tutor): lesson plans`.

---

## Phase D — Marketing + registration + parent

> Source: `Hz Academy.dc.html`.

### Task 22: Marketing home (HERO)

**Files:** Modify `app/pages/index.vue`. Create `app/components/marketing/Hero.vue`, `TrustStrip.vue`, `SubjectGrid.vue`, `BranchGrid.vue`, `HowToSteps.vue`, `Testimonials.vue`, `RecommendedSolution.vue`, `CtaBanner.vue`.
**Interfaces:** Consumes `useSubjects`, `useAcademy` (branches, stats). No store data inlined.
- [ ] **Step 1:** `Hero` — gradient base, 2 radial blobs, 3 badge pills, clipped-gradient H1 (Fredoka clamp), sub, 2 CTAs (gradient "Daftar Minat Sekarang →" → `/daftar`, outlined WhatsApp), 3 stats (1,000+ / 50+ / 10 thn), dashed hero placeholder + 2 floating `hzfloat`/`hzfloat2` badge cards.
- [ ] **Step 2:** `TrustStrip` (dark bar) → `SubjectGrid` (9 subject cards, hover-lift) → `BranchGrid` (4 branch cards from `academy.branches`, View Classes / Get Direction) → `HowToSteps` (4 numbered) → `Testimonials` (3) → `RecommendedSolution` (dark, 6 feature cards + Future Expansion pills) → `CtaBanner` (brand-gradient card).
- [ ] **Step 3: Verify** all sections match prototype top-to-bottom; CTAs route correctly.
- [ ] **Step 4:** Commit `feat(marketing): home page sections`.

### Task 23: Registration wizard + validation (HERO) (TDD for validation)

**Files:** Modify `app/pages/daftar.vue`. Create `app/components/marketing/RegistrationWizard.vue`, `Stepper.vue`. Create `app/utils/validation.ts`. Test: `test/utils/validation.spec.ts`.
**Interfaces:** Consumes `useSubjects`, `useAcademy`. `isValidMyPhone(s): boolean`, `canAdvance(step, form): boolean`.
- [ ] **Step 1: Failing test** — `test/utils/validation.spec.ts`:

```ts
import { isValidMyPhone, canAdvance } from '~/utils/validation'
it('validates Malaysian phone', () => {
  expect(isValidMyPhone('012-345 6789')).toBe(true)
  expect(isValidMyPhone('abc')).toBe(false)
})
it('gates step 2 on >=1 branch and step 3 on >=1 subject', () => {
  expect(canAdvance(2, { branches: [] } as any)).toBe(false)
  expect(canAdvance(2, { branches: ['kw'] } as any)).toBe(true)
  expect(canAdvance(3, { subjects: [] } as any)).toBe(false)
})
```

- [ ] **Step 2: Run, verify fail** → FAIL.
- [ ] **Step 3:** Implement `validation.ts` (phone regex `0\d{1,2}-?\d{3}\s?\d{4}`, `canAdvance` per-step rules: step0 name+phone, step2 ≥1 branch, step3 ≥1 subject). Run → PASS.
- [ ] **Step 4:** Build `RegistrationWizard` (760px) + `Stepper` (done ✓ green / active gradient / upcoming). 6 steps per spec; nav ← Kembali / Seterusnya → (disabled when `!canAdvance`) / Hantar Pendaftaran ✓. Submit → confirmation (🎉 green circle, Continue to WhatsApp / Kembali ke Utama).
- [ ] **Step 5: Verify** can't advance past gated steps; full happy path reaches confirmation.
- [ ] **Step 6:** Commit `feat(marketing): 6-step registration wizard with validation`.

### Task 24: Parent teaser

**Files:** Modify `app/pages/portal/ibubapa.vue`. Create `app/components/marketing/ParentPreview.vue`.
**Interfaces:** Consumes `useStudents`, `useClasses`, `useBilling` for one sample family (read-only).
- [ ] **Step 1:** Own header ("PORTAL IBU BAPA", parent avatar). Welcome H1, student card (avatar, name, Pelajar Aktif pill, 3 info tiles Cawangan/Subjek/Yuran), schedule card (3 classes), amber payment-reminder card, announcement card (📣).
- [ ] **Step 2: Verify** renders from composable data; reachable from Log Masuk dropdown.
- [ ] **Step 3:** Commit `feat(parent): parent portal teaser`.

### Task 25: Marketing motion (GSAP + Lenis)

**Files:** Modify `app/pages/index.vue` / a `marketing` plugin. Create `app/plugins/lenis.client.ts`. `npm i gsap lenis`.
**Interfaces:** Smooth scroll + on-scroll reveals on marketing only; respects `prefers-reduced-motion`.
- [ ] **Step 1:** Add Lenis smooth scroll (client plugin, marketing layout only). GSAP fade/translate reveals for sections; keep `hzfloat`/`hzpop` CSS keyframes for badges/dropdown.
- [ ] **Step 2: Verify** marketing scrolls smoothly with reveals; dashboards unaffected; reduced-motion disables it.
- [ ] **Step 3:** Commit `feat(marketing): GSAP/Lenis scroll motion`.

---

## Phase E — Polish

### Task 26: Responsive QA, watermark, cross-links, reconciliation, a11y

**Files:** touch-ups across components.
- [ ] **Step 1:** Mobile pass: admin/tutor sidebars → sticky horizontal nav under `md`; tables get `.hz-scroll`; marketing grids reflow; registration usable on phone.
- [ ] **Step 2:** Confirm `DemoWatermark` on every authenticated layout, links to `academy.contact.web`. Confirm all cross-portal links (Log Masuk ↔ portals, "Keluar" → `/`).
- [ ] **Step 3:** Reconciliation sweep: tutor dashboard / tutor Pendapatan / admin Educators / admin Payroll all show RM 1,710 for Hafiz. Run `npx vitest run` → all green.
- [ ] **Step 4:** Accessibility: focus-visible rings on interactive elements, `aria-label`s on icon-only buttons (🔔, ✕, segmented controls), alt text/role on decorative placeholders, color-contrast check on muted text.
- [ ] **Step 5:** Grep guard: no component imports `stores/academy` or seed arrays directly; no "Hz" literal outside `config/academy.ts`. `grep -rn "useAcademyStore" app/components app/pages` returns nothing.
- [ ] **Step 6:** Commit `chore: responsive QA, a11y, reconciliation, watermark`.

---

## Self-review notes (coverage map)

- Spec "Foundation" → Tasks 1–8. "Admin HERO/SUPPORTING/STUB" → Tasks 9–16. "Tutor HERO/SUPPORTING" → Tasks 17–21. "Marketing/registration/parent" → Tasks 22–25. "Polish" → Task 26.
- Payroll invariant → enforced in Tasks 5, 6, 12, 17, 20, and re-checked in 26.
- Data seam → established Task 6, guarded Task 26 Step 5.
- Stay-generic → Task 2, guarded Task 26 Step 5.
- Interactivity (wizard, dropdown, filters, modal, attendance, syllabus) → Tasks 23, 8, 10/14, 13, 19, 15.
- Real nested routing → Tasks 8, 11, 12, 19.
- Stubs "sedang dibina" → Task 16.
