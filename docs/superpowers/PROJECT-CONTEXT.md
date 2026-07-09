# Academy Platform — full project context

> **Purpose of this file.** A single, self-contained brief you can paste or upload into a fresh
> claude.ai conversation (or hand to any collaborator) to carry the full context of this project
> without the repo open. It captures what the product is, the rules that govern it, the
> architecture, the data model, the screen inventory, and where things stand. Read it top to
> bottom once; after that, jump to the section you need.
>
> Last synced to the codebase: 2026-07-05. If the code and this file disagree, the code wins,
> update this file.

---

## 1. What this is (elevator)

A **frontend-only mockup** of a management platform for Malaysian tuition centres. Internal
working name: **"Academy Platform"**. The customer-facing brand is undecided and lives only in
`config/academy.ts`. First design-partner centre: **Hz Academy** (Pusat Tuisyen Hz Academy,
trusted since 2014). Product IP owned by **Axel Nova Ventures**. Tagline: *"Simple, effortless,
human."*

It replaces the spreadsheet + WhatsApp + Google Calendar patchwork that most Malaysian centres
run on: one system for enquiries, students, tutors, classes, schedules, attendance, billing, and
hourly tutor payroll.

**This repo is a sales and validation prototype.** There is **no backend**. All data is seeded
fake data. Optimise for demo clarity and a convincing click-through, not production patterns. It
is deliberately built in the real production stack so nothing is thrown away when the backend
arrives later (planned: Laravel 11, MySQL, FPX/DuitNow via Billplz).

**Why local-first (the moat):** KPM syllabus alignment, local payment rails (FPX/DuitNow), LHDN
e-Invoice on the roadmap, WhatsApp-native enquiry flows. A foreign product cannot easily copy
these.

---

## 2. Governing principles (binding — these override default engineering instincts)

1. **Full SHOW, phased SELL.** Mock the complete four-portal vision so a buyer can click the
   dream, but the real build ships in phases. Build the screens that sell first.
2. **Mock what sells, stub the rest.** Screens are tiered **HERO / SUPPORTING / STUB**. Only HERO
   screens get full fidelity and fake interactivity. SUPPORTING are lighter. STUB are titled,
   styled "sedang dibina" placeholders that prove the feature exists.
3. **The data seam is sacred.** All data is accessed through composables (`useStudents()`,
   `usePayroll()`, …) that read from one seeded Pinia store. **Never inline data in components.**
   When a backend exists later, only composable internals change. This is what stops the mockup
   from being throwaway.
4. **Stay generic.** Hz Academy is configured-instance-one, not hardcoded. Name, logo, palette,
   branches all come from `config/academy.ts`. Re-skinning the next centre must be a config edit,
   not a refactor. **Theming only, not multi-tenancy.** Do not build owner-scoping or per-tenant
   billing.
5. **Money is handled with care.** Payroll and billing show **pre-computed / derived** output. Do
   not build live financial calculation logic wired to inputs. Payroll rules get validated in
   plain language with the owner before any real implementation.

### What NOT to do
- No backend, no API calls, no real auth library. "Auth" is a portal/role switcher.
- No live financial calculations wired to inputs.
- No multi-tenancy plumbing (owner scoping, per-tenant billing).
- No new fonts or hues beyond the defined tokens.
- **No data inlined in components, ever. Go through composables.**

---

## 3. Tech stack

- **Nuxt 4** (uses the `app/` directory), **Vue 3**, `<script setup lang="ts">`, **TypeScript strict**
- **SPA / static** rendering — `ssr: false`, no server routes
- **@nuxt/ui v4** (brings **Tailwind v4**) for heavy primitives: tables, forms, modals, overlays
- **Tailwind v4 CSS-first**, theme tokens as **OKLCH** in an `@theme` block
- **Pinia** for the single seeded data store (`@pinia/nuxt`)
- **@nuxt/fonts** — Plus Jakarta Sans (body), Fredoka (display)
- **GSAP + Lenis** for motion, **marketing page only**. Dashboards stay calm and fast, no animation.
- **Vitest** + @vue/test-utils + happy-dom for unit tests (pure logic only)

`package.json` scripts: `dev`, `build`, `generate` (static), `preview`, `test` (`vitest run`),
`test:watch`, `typecheck` (`nuxt typecheck`).

Key `nuxt.config.ts` facts: `ssr: false`; modules `@nuxt/ui`, `@nuxt/fonts`, `@pinia/nuxt`;
`components` auto-import with `pathPrefix: false` (so `<StatCard>` not `<UiStatCard>`); `htmlAttrs.lang: 'ms'`; favicon `/favicon.svg`.

---

## 4. Repository structure (annotated)

```
academy-platform/
├── CLAUDE.md                      # persistent instructions for Claude Code (the rulebook)
├── README.md                      # public-facing product README
├── nuxt.config.ts                 # ssr:false, modules, fonts, head
├── config/
│   └── academy.ts                 # ★ SINGLE SOURCE OF TRUTH for centre identity/branding
├── public/
│   ├── favicon.svg
│   └── _redirects                 # Cloudflare Pages SPA fallback (/* -> /index.html 200)
├── app/
│   ├── app.vue
│   ├── assets/css/main.css        # ★ Tailwind v4 @theme, OKLCH tokens, gradients, keyframes
│   ├── types/
│   │   ├── academy.ts             # Academy, Branch, AcademyContact (tenant identity types)
│   │   └── index.ts               # ★ all domain entity types (the data model)
│   ├── stores/
│   │   └── academy.ts             # ★ the ONE Pinia store with all seeded data
│   ├── composables/               # ★ THE DATA SEAM — only access layer to the store
│   │   ├── useAcademy.ts          #   branding/config accessor
│   │   ├── useStudents.ts         #   students + guardians joins
│   │   ├── useGuardians.ts
│   │   ├── useEducators.ts
│   │   ├── useClasses.ts
│   │   ├── useSchedule.ts         #   builds the weekly grid cells
│   │   ├── useLessonPlans.ts
│   │   ├── useSubjects.ts
│   │   ├── useAttendance.ts       #   live attendance edits (present/late/absent)
│   │   ├── usePayroll.ts          #   ★ derives pay from sessions (see invariant)
│   │   ├── useBilling.ts          #   invoices, outstanding
│   │   ├── useEnquiries.ts        #   marketing/admin enquiry list
│   │   ├── useFeedback.ts
│   │   ├── useAdminMetrics.ts     #   centre-wide headline numbers
│   │   └── usePortalNav.ts        #   adminNav (9 items) + tutorNav (5 items)
│   ├── layouts/
│   │   ├── marketing.vue          # marketing shell (+ FloatingWhatsApp)
│   │   ├── admin.vue              # admin portal shell (sidebar nav)
│   │   └── tutor.vue              # tutor portal shell (sidebar nav)
│   ├── components/
│   │   ├── ui/                    # shared primitives (PortalShell, DataTable, StatCard,
│   │   │                          #   StatusPill, AppButton, DemoWatermark, LogoMark, …)
│   │   ├── marketing/             # Hero, SubjectGrid, BranchGrid, RegistrationWizard,
│   │   │                          #   Testimonials, LoginDropdown, FloatingWhatsApp, …
│   │   ├── admin/                 # RevenueHero, ScheduleGrid, OutstandingList, StubScreen, …
│   │   └── tutor/                 # EarningsHero, AttendanceRoster, TodayClasses, ClassCard, …
│   ├── pages/                     # file-based routes (see §8 for the full inventory)
│   └── utils/
│       ├── money.ts               # RM formatting (RM ${n.toLocaleString('en-MY')})
│       ├── status.ts              # status -> tone/label maps
│       ├── tone.ts                # subject/status tone -> CSS token keys
│       └── validation.ts          # registration form validation (pure)
├── test/                          # Vitest — pure logic only
│   ├── setup.ts
│   ├── utils/money.spec.ts
│   ├── utils/validation.spec.ts
│   ├── composables/payroll.spec.ts
│   ├── composables/attendance.spec.ts
│   └── store/payroll.spec.ts
└── docs/superpowers/
    ├── PROJECT-CONTEXT.md         # ← this file
    ├── plans/2026-06-28-hz-academy-prototype.md      # task-by-task implementation plan
    └── specs/2026-06-28-hz-academy-prototype-design.md  # approved design spec
```

★ = the files that define the architecture. If you read only five files, read these:
`config/academy.ts`, `app/types/index.ts`, `app/stores/academy.ts`, `app/composables/usePayroll.ts`,
`app/assets/css/main.css`.

---

## 5. The data seam (the most important architectural rule)

```
config/academy.ts  ──►  app/stores/academy.ts  ──►  app/composables/*  ──►  components / pages
   (identity)              (ONE seeded store)          (the ONLY access layer)
```

- Components and pages **never** import the Pinia store or seed arrays directly. They call a
  composable.
- Every composable carries the comment:
  `// swap internals for API calls when backend lands; signature stays stable`
- When the real backend arrives, only the **inside** of each composable changes (fetch instead of
  read store). Component code is untouched. This is what makes the frontend-first work
  non-disposable.

**Composable inventory** (all in `app/composables/`, all return plain accessors/derived values):
`useAcademy`, `useStudents`, `useGuardians`, `useEducators`, `useClasses`, `useSchedule`,
`useLessonPlans`, `useSubjects`, `useAttendance`, `usePayroll`, `useBilling`, `useEnquiries`,
`useFeedback`, `useAdminMetrics`, plus `usePortalNav` (exports `adminNav`, `tutorNav`).

**The store** (`app/stores/academy.ts`, Pinia option store `'academy'`) holds: `academy` config,
`subjects`, `marketingSubjects`, `guardians`, `students`, `educators`, `classes`, `sessions`,
`invoices`, `lessonPlans`, `enquiries`, `feedback`, `agenda`, `syllabusBank`, `subjectTutor`,
`subjectSchedule`, `metrics`, `weekStarts`, `weekLabels`, `tutorSelfId: 'hafiz'`, and live
`attendance` edits. Getters: `branches`. Actions: `setAttendance(key, status)`, `resetAttendance()`.

---

## 6. Data model (the spine)

All entities are typed in `app/types/index.ts` (identity types in `app/types/academy.ts`).

Core entities: **Branch, Guardian, Student, Educator, Subject, Class, LessonPlan, Attendance,
Session, Invoice, PayrollRun, Feedback** (plus Enquiry, and view helpers ScheduleCell, SyllabusRow).

### Two relationships that MUST stay consistent

1. **Session → pay (the money invariant).** A `Session` has `durationHours`. A tutor's pay for a
   period is `sum(their session durations) × hourly rate` — **derived, never hand-entered**. The
   "estimated pay this month" on the tutor dashboard **must equal** what the admin payroll screen
   computes from the same sessions.
   - Canonical example baked into the seed: **Cikgu Hafiz = 38h × RM 45 = RM 1,710**. This must
     reconcile across: tutor dashboard, tutor Pendapatan (earnings), admin Educators column, and
     admin Payroll — all recomputed from the same `sessions` array via `usePayroll()`.
   - The seed builds sessions from a class×week matrix (`HAFIZ_MATRIX`) and per-educator weekly
     arrays (`OTHER_WEEKLY`) so that per-educator session sums exactly equal each `educator.hours`.
     `usePayroll()` exposes `runFor`, `weeklyBreakdown`, `byClass`, `hoursFor`.

2. **Class = Subject + Educator + Branch + Schedule + Students.** Most screens are a view onto
   `Class` from a different angle (schedule grid, classroom roster, syllabus, payroll-by-class).

### Seed data facts (for demo consistency)
- **4 branches** (from `config/academy.ts`): Kota Warisan Sepang, Taman Sutera Kajang, Taman
  Ixora (Seri Kembangan), Pekan (Pahang).
- **8 students** (detailed slice), **8 guardians**, **6 educators**, **12 classes** (Hafiz's 4 +
  8 others), **8 invoices**, **6 lesson plans**, **4 enquiries**, **2 feedback notes**.
- Data is realistically Malaysian: real-format names, RM amounts, KPM-flavoured subjects, mixed
  SK/SJKC/SMK schools, bilingual labels.
- **Detailed slice vs headline metrics are intentionally different scale.** The inspectable seed
  is small (8 students) but `metrics` shows full centre scale (342 active students, RM 82,080
  revenue, 9 classes today, etc.) so the demo looks real while the slice stays readable. Do not
  try to reconcile the 8-student slice with the 342 headline — that gap is by design.
- Period context: seed centres on **June 2026** (4 weeks: `2026-06-02 … 2026-06-23`).

---

## 7. Design system & conventions

### Theme (Hz theme, in `app/assets/css/main.css`)
Warm, friendly education brand. Rounded pills (radius 999px), rounded cards (~13–30px), soft
shadows, 1px tint borders. All colours are **OKLCH tokens** in an `@theme` block; do not introduce
hues outside the token set.

Palette anchors: brand `#8B6CF0`, brand-deep `#6B4BD6`, accent-pink `#FF7AA8`, accent-blue
`#3DA5F4`; ink `#1E2348`; whatsapp `#25D366`. Subject "tile" tones come in bg/fg pairs
(`--color-tile-*` / `--color-fg-*`) keyed by `SubjectTone` (`pink|blue|violet|green|amber|orange|
indigo|rose`). Gradients (brand, green, hero-dark, dashed stripes) live under `:root`. Marketing
keyframes: `hzfloat`, `hzfloat2`, `hzpop` (all disabled under `prefers-reduced-motion`).

Fonts: **Plus Jakarta Sans** (`--font-sans`, body), **Fredoka** (`--font-display`, headings via
`.font-display`).

### Copy conventions
- **Sentence case everywhere.** No title case headers.
- **No em dashes.** Use commas, periods, or "to" for ranges.
- **Bilingual where natural**, and the direction differs per portal:
  - Marketing: **Malay-primary**.
  - Admin: **English label over smaller Malay sub-label**.
  - Tutor: **Malay label over smaller English sub-label**.
- Warm, non-corporate tone. Motto: "Simple, effortless, human."
- Money format: `RM ${n.toLocaleString('en-MY')}` (see `app/utils/money.ts`).

### KPM syllabus model
Stages: **Sekolah Rendah** (Tahun 1–6), **Menengah Rendah** (Tingkatan 1–3), **Menengah Atas**
(Tingkatan 4–5). Stage keys in code: `'rendah' | 'mr' | 'ma'`. Core subjects (BM, BI, Matematik,
Sains, Sejarah, Geografi, Pendidikan Islam) plus STEM and TVET. Only a convincing slice is
populated — do not build the full national syllabus.

### Integrations posture
Zoom and Microsoft are **integration stubs** (a "Join class" button, a settings toggle), never
custom-built video. Keep them clearly in the integration column, not the build column.

---

## 8. Portals & screen inventory (with tiers and current routes)

Fake "auth" is a portal/role switcher (via `LoginDropdown` on marketing). Routes are real nested
Nuxt file-based routes; master-detail is a `[id]` route param.

### Marketing portal — `layouts/marketing.vue`
Ad-conversion page, Meta Pixel intent, WhatsApp funnel. Motion via GSAP/Lenis here only.
- `pages/index.vue` — landing page (Hero, TrustStrip, SubjectGrid, HowToSteps,
  RecommendedSolution, BranchGrid, Testimonials, CtaBanner, SiteHeader/Footer, FloatingWhatsApp)
- `pages/daftar.vue` — 6-step **RegistrationWizard** (student registration flow)
- `pages/portal/parents.vue` — **parent/student teaser** (one screen only; everything else stubbed)

### Admin portal (the meeting-winner) — `layouts/admin.vue`, nav = 9 items
- **HERO:** Dashboard `pages/admin/index.vue`; Students+guardians `students/index.vue` and detail
  `students/[id].vue`; Educators `educators/index.vue` and detail `educators/[id].vue`; Schedule &
  lesson plans `schedule.vue`; Student billing `billing.vue`
- **SUPPORTING:** Syllabus / e-learning tree `syllabus.vue`; Tutor payroll output `payroll.vue`
- **STUB:** Branches `branches.vue`; Settings & integrations `settings.vue` (Zoom / Microsoft /
  WhatsApp toggles). (Audit log is mentioned in the vision but rendered via the stub pattern.)

### Tutor portal (the stickiness) — `layouts/tutor.vue`, nav = 5 items (Malay-primary routes)
- **HERO:** Dashboard `pages/tutor/index.vue`; Classroom list `kelas/index.vue` + student/class
  detail `kelas/[id].vue`; Salary & payslip `pendapatan.vue`; (Onboarding is part of the flow)
- **SUPPORTING:** My schedule `jadual.vue`; My syllabus / lesson plans `rancangan.vue`
- The tutor persona is **Cikgu Hafiz** (`tutorSelfId: 'hafiz'`), whose 4 classes and sessions
  drive the RM 1,710 payroll invariant.

### Parent / student portal
**One teaser screen only** (`portal/parents.vue`). Everything else stubbed. Do not build out until
admin and tutor close a deal.

Reusable stub pattern lives in `app/components/admin/StubScreen.vue` (titled, styled "sedang
dibina" placeholder). `DemoWatermark` marks the whole thing as a prototype.

---

## 9. Testing, deployment, running

**Tests (Vitest, pure logic only):** `test/utils/money.spec.ts`, `test/utils/validation.spec.ts`,
`test/composables/payroll.spec.ts`, `test/composables/attendance.spec.ts`,
`test/store/payroll.spec.ts`. Visual fidelity is verified by eye against the design prototypes, not
snapshot-tested. Run with `npm run test`. Typecheck with `npm run typecheck`.

**Deployment:** Cloudflare Pages, **static** (`npm run generate`). `public/_redirects` provides the
SPA fallback (`/*  /index.html  200`) so client-side routes resolve on refresh. No env vars, no
backend needed.

**Run locally:**
```bash
npm install      # install deps (runs nuxt prepare via postinstall)
npm run dev      # dev server
npm run generate # static build for Cloudflare Pages
npm run test     # unit tests
```

---

## 10. Build sequence & current status

Original staged plan (from CLAUDE.md), each stage had a checkpoint:
0. Foundation: scaffold, theme tokens, types, seeded store, composable seam, academy config,
   portal shells and nav. ✅
1. Admin dashboard + Students. ✅
2. Tutor dashboard + payslip. ✅
3. Schedule + Classroom (ties admin and tutor together). ✅
4. Billing + payroll output. ✅
5. Parent teaser. ✅
6. Polish, mobile pass, demo watermark, login split. ← in progress

**Where it is now (per git + file tree):** the full hi-fi prototype is built out — all three
portals, all listed pages exist, the composable seam and seeded store are in place, tests pass for
the pure logic. Recent commits are polish work on the marketing layer:
- `FloatingWhatsApp` component added to the marketing layout
- favicon.svg + nuxt.config favicon links
- Cloudflare Pages static deploy configured
- LoginDropdown accessibility (click + key handling)
- DemoWatermark repositioned

**Uncommitted working changes** at last check: `BranchGrid.vue`, `FloatingWhatsApp.vue`,
`SiteHeader.vue` (marketing polish).

The two design docs in `docs/superpowers/` are the deeper source of truth for the original scope:
- `specs/2026-06-28-hz-academy-prototype-design.md` — the approved design spec
- `plans/2026-06-28-hz-academy-prototype.md` — the task-by-task implementation plan (checkbox
  format, built via superpowers subagent-driven development)

---

## 11. How to continue this work (in claude.ai or elsewhere)

If you are picking this up fresh, the safe workflow is:

1. **Respect the 5 governing principles in §2.** They override normal engineering instincts. The
   two that get violated most: "data seam is sacred" (never inline data — add/extend a composable)
   and "money with care" (never hand-enter or live-calculate pay — derive from sessions).
2. **To add a screen:** decide its tier (HERO/SUPPORTING/STUB). Add the route under the right
   portal folder, use the portal layout, pull data via a composable (add one if needed, with the
   standard swap-internals comment), style with existing tokens only.
3. **To re-skin for a new centre:** edit `config/academy.ts` only (name, tagline, contact,
   branches). If the palette must change, edit the OKLCH tokens in `main.css`. Nothing else should
   reference "Hz".
4. **To touch payroll/billing:** keep it derived. If you change a session duration or rate, the
   RM 1,710 (and all headline numbers) should still reconcile everywhere. Add/adjust the Vitest
   specs.
5. **Copy:** sentence case, no em dashes, correct bilingual direction per portal.
6. **Marketing motion only.** Keep dashboards animation-free.

**Deliberately out of scope (do not build unprompted):** real backend/API, real auth, live
financial calc, multi-tenancy/owner-scoping, the full KPM syllabus, custom video, the full parent
portal.

---

## 12. Quick reference

| Thing | Where |
|---|---|
| Centre identity / branding | `config/academy.ts` |
| All domain types | `app/types/index.ts` (+ `app/types/academy.ts`) |
| The one seeded store | `app/stores/academy.ts` |
| Data access layer (seam) | `app/composables/*` |
| Payroll derivation (money invariant) | `app/composables/usePayroll.ts` |
| Theme tokens (OKLCH) | `app/assets/css/main.css` |
| Portal nav definitions | `app/composables/usePortalNav.ts` |
| Marketing page | `app/pages/index.vue` |
| Admin routes | `app/pages/admin/*` |
| Tutor routes | `app/pages/tutor/*` |
| Parent teaser | `app/pages/portal/parents.vue` |
| Registration wizard | `app/pages/daftar.vue` + `components/marketing/RegistrationWizard.vue` |
| Rulebook for Claude | `CLAUDE.md` |
| Design spec / plan | `docs/superpowers/specs/…` and `…/plans/…` |

**Payroll invariant to remember:** Cikgu Hafiz = **38h × RM 45 = RM 1,710**, reconciled everywhere
from the same `sessions`.

**Motto:** Simple, effortless, human.
