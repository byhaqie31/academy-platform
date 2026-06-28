# Hz Academy — hi-fi interactive prototype (design spec)

Date: 2026-06-28
Status: approved (build scope: full hi-fi prototype, one push)
Source of truth: `design_handoff_hz_academy/` (three `.dc.html` prototypes + README + CLAUDE.md kickoff)

## Goal

A clickable, no-backend mockup of a management platform for Malaysian tuition
centres, built in the production stack so nothing is thrown away when the
backend arrives. First design-partner centre: Hz Academy. This spec covers the
**full vision in one build**: marketing site + 6-step registration + parent
teaser, the Admin portal (all tabs), and the Tutor portal (all tabs), pixel
faithful to the prototypes and fully interactive where the brief marks a screen
HERO.

This is a sales and validation prototype. Optimise for demo clarity and a
convincing click-through, not production patterns. All data is seeded.

## Governing principles (binding, from CLAUDE.md)

1. **Full SHOW, phased SELL.** Mock the complete four-portal vision. Build the
   screens that sell first.
2. **Mock what sells, stub the rest.** Screens are tiered HERO / SUPPORTING /
   STUB. Only HERO get full fidelity + fake interactivity. STUB are titled,
   styled "sedang dibina" placeholders.
3. **The data seam is sacred.** All data is accessed through composables that
   read from one seeded Pinia store. Never inline data in components. When a
   backend lands, only composable internals change.
4. **Stay generic.** Nothing about Hz is hardcoded outside `config/academy.ts`.
   Re-skinning the next centre is a config edit, not a refactor. Theming only,
   no multi-tenancy plumbing.
5. **Money is handled with care.** Payroll + billing show pre-computed output
   derived from sessions. No live financial-calculation logic wired to inputs.

## Stack

- Nuxt 4 (`app/` dir), Vue 3 `<script setup lang="ts">`, TypeScript strict
- SPA / static rendering, no server routes
- Tailwind v4 CSS-first, theme tokens as OKLCH in `@theme`
- @nuxt/ui v4 in the stack; used for heavy interactive primitives
  (modal/overlay, select/inputs) only. Visual components are custom against the
  token system so we hit the prototypes pixel-for-pixel.
- Pinia for the seeded store
- Fonts: Plus Jakarta Sans (body), Fredoka (display)
- GSAP + Lenis on the **marketing page only**. Dashboards stay calm, no motion.

## Approved decisions

- **Routing: real nested URLs** (not the prototype's index-based view state).
  `/admin/students/[id]`, `/tutor/kelas/[id]` etc. Shareable, back-button
  correct, feels like a real product. Master-detail = route param, not a
  `studentSel` index.
- **Styling: custom components on the OKLCH token system**, @nuxt/ui only where
  it earns its keep. Keeps fidelity high without fighting the UI kit's theme.
- **Scope: everything in one push** — marketing + registration + parent teaser
  + full admin + full tutor. Parent is a single teaser screen (per brief).
  Marketing motion (GSAP/Lenis) included now.
- **Fidelity follows the prototypes over the kickoff brief where they differ**
  (the `.dc.html` files are hi-fi source of truth). Notably:
  - Admin nav is **9 items** (no "Audit" tab the kickoff mentioned).
  - Tutor nav is **5 items** (not the kickoff's 4).
  - Each portal's bilingual pattern is reproduced exactly (admin =
    English-over-Malay; tutor = Malay-over-English; marketing = BM-primary).

## File structure

```
config/academy.ts            # all Hz identity: name, tagline, contact, branches, theme refs, logo
app/
  assets/css/main.css        # @theme OKLCH tokens, font faces, ::selection #FFD3E2, keyframes
  types/index.ts             # all entity interfaces (see Data model)
  stores/academy.ts          # ONE seeded Pinia store, internally consistent MY data
  composables/               # the data seam (see Composables)
  components/
    ui/                      # StatCard, StatusPill, SubjectChip, IconTile, DataTable,
                             # GradientButton, SectionHeading, EmptyState, DemoWatermark
    marketing/               # Header, LoginDropdown, Hero, TrustStrip, SubjectGrid, BranchGrid,
                             # HowToSteps, Testimonials, RecommendedSolution, CtaBanner, Footer,
                             # RegistrationWizard, ParentPreview
    admin/                   # AdminSidebar, AdminTopbar, RevenueHero, ScheduleToday, EnquiryList,
                             # OutstandingList, StudentDetail, EducatorDetail, ScheduleGrid,
                             # SyllabusBank, BillingTable, AssignClassModal
    tutor/                   # TutorSidebar, TutorTopbar, TodayClasses, EarningsMini, PlansThisWeek,
                             # TutorScheduleGrid, ClassCard, AttendanceRoster, EarningsHero
  layouts/
    marketing.vue, admin.vue, tutor.vue
  pages/
    index.vue                # marketing home
    daftar.vue               # 6-step registration wizard
    portal/ibubapa.vue       # parent teaser
    admin/index.vue          # dashboard
    admin/students/index.vue admin/students/[id].vue
    admin/educators/index.vue admin/educators/[id].vue
    admin/schedule.vue admin/syllabus.vue admin/billing.vue
    admin/payroll.vue admin/branches.vue admin/settings.vue   # STUB pattern
    tutor/index.vue          # dashboard
    tutor/jadual.vue         # Jadual Saya (weekly grid)
    tutor/kelas/index.vue tutor/kelas/[id].vue                # Classes + attendance (HERO)
    tutor/rancangan.vue tutor/pendapatan.vue
CLAUDE.md                    # copied from handoff to repo root (binding context)
```

## Design tokens (from handoff, to `@theme` as OKLCH)

- Brand gradient `linear-gradient(135deg,#8B6CF0,#FF7AA8 60%,#FFA94D)`.
  brand `#8B6CF0`, brand-deep `#6B4BD6`, accent-pink `#FF7AA8`,
  accent-orange `#FFA94D`, accent-blue `#3DA5F4`.
- Ink `#1E2348`, ink-footer `#15193A`, text-body `#3A3F5C`,
  ink-soft/muted `#5B6080`, faint `#8388A5`, faintest `#A0A4B8`,
  disabled `#B7BACA`.
- Surfaces: bg-app `#F7F6FB`, surface `#FFFFFF`, surface-subtle `#FBFAFE`,
  surface-lavender `#FBF8FF`. Borders: `#ECEAF4` (portal), `#F0EEF6` (marketing),
  input `#E6E2F2`, divider `#F2F0F8`.
- Subject/category tile pairs (bg / fg): pink `#FFE6F0`/`#E0457E`,
  blue `#EAF3FF`/`#1F6FB8`, violet `#F1ECFF`/`#6B4BD6`, green `#E8F7EE`/`#1E9E5A`,
  amber `#FFF4D6`/`#9A6B00`, orange `#FFEDD9`/`#C2700A`, indigo `#E8EAFF`/`#5A55D6`,
  rose `#FFF0F5`/`#C04C82`.
- Status (bg/fg): Paid/Active/Present `#E8F7EE`/`#1E9E5A`,
  Pending/Late/Trial `#FFF4D6`/`#9A6B00`, Overdue/Absent `#FFE6F0`/`#D64545`,
  New `#EAF3FF`/`#1F6FB8`, Inactive `#F1F0F6`/`#8388A5`.
- WhatsApp `#25D366` (hover `#149E4A`/`#34C77B`).
- Radius: pills 999px, buttons/inputs 10–14px, cards 18–24px, logo 13px.
- Shadows + keyframes (`hzfloat`, `hzfloat2`, `hzpop`) exactly per handoff.
- Fonts: Fredoka (display/headings/big numbers), Plus Jakarta Sans (body/UI).
- Icons: emoji, kept as-is for the playful brand (per-category colour pairing
  preserved).

## Data model (typed in `app/types/`)

Entities: `Branch, Guardian, Student, Educator, Subject, Class, LessonPlan,
Attendance, Session, Invoice, PayrollRun, Feedback, Enquiry`.

Shapes (from prototype `renderVals()`):
- **Subject** `{ name, short, icon, bg, tile, stage }`, keyed by name.
- **Student** `{ id, name, first, level, branch, subjects[], enrol:'Aktif'|'Percubaan'|'Tidak aktif', pay:'Paid'|'Pending'|'Overdue', guardianId, attendancePct }`.
- **Guardian** `{ id, name, phone, studentIds[] }`.
- **Educator** `{ id, name, subjects[], branches:string, rate, hours }` → `pay = rate*hours`.
- **Class** `{ id, subject, cls, level, day, time, ampm, branch, dur, educatorId, attendPct, roster:string[] }`.
- **Session** `{ id, classId, educatorId, date, durationHours }` — the spine for payroll.
- **Invoice** `{ id, studentId, name, branch, amount, status, proof:bool, period }`.
- **LessonPlan** `{ id, classId, cls, week, topic, ref(KPM), material|null, attached:bool }`.
- **Enquiry** `{ id, name, ago, detail, source:'Facebook'|'TikTok'|'Google Ads', status }`.
- **PayrollRun** derived from Sessions per educator per period.

### The one invariant that must hold across screens

A tutor's pay for a period = `sum(session.durationHours) × educator.rate`. The
tutor dashboard "estimated pay this month", the tutor Pendapatan screen, the
admin Educators "Anggaran gaji" column, and the admin Payroll output MUST all
recompute the **same** number from the **same** `Session[]`. Concretely: Cikgu
Hafiz = 38h × RM 45 = **RM 1,710**, and that must reconcile everywhere. Money is
formatted `RM {n.toLocaleString('en-MY')}`.

## Composables (the only data-access layer)

`useAcademy, useStudents, useGuardians, useEducators, useSubjects, useClasses,
useSchedule, useAttendance, usePayroll, useBilling, useFeedback, useEnquiries,
useAdminMetrics`. Each returns typed data from the store and carries the comment
"swap internals for API calls when backend lands; signature stays stable."
`useAdminMetrics` computes dashboard tiles (enquiries, active students, classes
today, outstanding total, revenue/margin). `useAttendance` exposes a real
read+write surface — the tutor attendance screen mutates it.

## Screens

### Marketing (`/`) — HERO
Sticky translucent blurred header: logo + nav pills (Utama, Daftar Minat) +
"🔐 Log Masuk ▾" dropdown (3 portal rows → /admin, /tutor, parent) + green
WhatsApp CTA. Home sections top→bottom: Hero (gradient base, 3 badge pills,
clipped-gradient H1, 2 CTAs, 3 stats, dashed hero placeholder with two floating
`hzfloat` badge cards) → dark Trust strip → Subjek & Program (9 subject cards,
hover-lift) → Cawangan (4 branch cards) → Cara Daftar (4 numbered steps) → Kata
Ibu Bapa (3 testimonials) → Recommended Solution (dark, 6 feature cards + Future
Expansion pills) → CTA banner (brand-gradient card) → Footer (#15193A, 4 cols).
Motion: GSAP/Lenis + `hzfloat`/`hzpop`.

### Registration (`/daftar`) — HERO
760px max. 6-step wizard with horizontal stepper. Step 0 Ibu Bapa (name +
WhatsApp phone) · Step 1 Pelajar (name + level + school) · Step 2 Cawangan (4
selectable tiles) · Step 3 Subjek (9 selectable chips) · Step 4 Jadual (4 slot
chips + notes) · Step 5 Semak (review grid). Nav: ← Kembali / Seterusnya →
(gradient) / Hantar Pendaftaran ✓ (green). On submit → confirmation (🎉 green
circle). **Production validation wired:** required name + Malaysian phone
`0XX-XXX XXXX`, ≥1 branch before leaving step 2, ≥1 subject before leaving
step 3.

### Parent teaser (`/portal/ibubapa`) — single screen
Own header. Welcome H1, student card (avatar, name, Pelajar Aktif pill, 3 info
tiles), schedule card (3 classes), amber payment-reminder card, announcement
card. Read-only.

### Admin portal — HERO/SUPPORTING/STUB
Shell: 248px sticky white sidebar (logo, PENGURUSAN section, 9 nav items with
violet active state, profile chip "Admin Hz / Kota Warisan", "← Keluar ke laman
web"), white sticky topbar (tab title, search, 🔔 with pink dot, gradient
avatar). Content max-width 1280px.
- **Dashboard** (HERO): greeting + date + dark "+ Daftar pelajar baru"; 4 stat
  cards; dark **revenue/margin hero** (RM 40,680, ↑49.6% margin, stacked bar +
  2 mini cards); two-col Jadual hari ini + (Enquiry dari iklan with source pills
  + filter, Bayaran tertunggak).
- **Students** (HERO): list (search + 4 filter dropdowns, table with status
  pills, row → detail) and **detail** (`/admin/students/[id]`: header card,
  subjects/classes, payment history with proof thumbnails, guardian card +
  WhatsApp, attendance conic donut 92%).
- **Educators** (HERO): list (rate, hours, computed Anggaran gaji green) +
  detail (profile, dark Anggaran gaji card, assigned classes, weekly-hours bars).
- **Schedule** (HERO): subject legend + weekly grid (`64px repeat(6,1fr)`,
  4 time rows, filled cells = subject bg + 3px left border) + lesson-plan cards
  + **AssignClassModal** (overlay blur, 520px card, pseudo-selects + slot chips,
  Batal / Tetapkan kelas ✓).
- **Syllabus** (SUPPORTING): 3 stage pills (Rendah/MR/MA) + subject bank +
  selected-subject detail.
- **Billing** (HERO): 3 summary cards + filter pills + invoice table (proof
  thumb / "— Belum ada", status, ✓ Tandakan dibayar / Lihat resit).
- **Payroll / Branches / Settings** (STUB): header + 3 stat cards + centered
  "sedang dibina" empty state.

### Tutor portal — HERO/SUPPORTING
Persona **Cikgu Hafiz** (Matematik, 2 branches, RM 45/hr, 38h → RM 1,710).
Shell mirrors admin; profile chip "Cikgu Hafiz / Matematik · 2 cawangan", pink
"H" tile avatar in topbar (distinguishes tutor from admin). 5 nav items.
- **Dashboard** (HERO): greeting "Selamat petang, Cikgu Hafiz 👋"; 4 stat cards
  (Classes today 2 pink, Hours 6.5j blue, Students 24 violet, Est. salary
  RM 1,710 green); two-col Kelas hari ini (rows with "Tanda kehadiran →") +
  (earnings mini dark card + Rancangan minggu ini).
- **Jadual Saya** (HERO): branch legend, weekly grid of this tutor's 4 Matematik
  classes, cells clickable → class detail.
- **Kelas & Pelajar** (HERO): 4 class cards → **detail = the key interactive
  attendance screen**: header card, "Tanda kehadiran" + session date, live
  summary pills (Hadir/Lewat/Tidak), roster rows each with a 3-button
  Hadir/Lewat/Tidak segmented control (default present, active fills status
  colour), Set semula + Simpan kehadiran (label flips to "Kehadiran disimpan ✓";
  any later change resets saved=false).
- **Rancangan Mengajar** (SUPPORTING): 4 lesson-plan cards (class pill, week,
  topic, KPM ref, file chip or dashed + Lampirkan bahan).
- **Pendapatan** (HERO): big dark earnings hero (RM 1,710, ↑4 jam dari Mei,
  "38 jam × RM 45/jam · Dibayar 5 Julai 2026", JAM DIREKOD/KADAR mini cards) +
  two-col weekly-hours bars (total 38j) + Jam mengikut kelas (hours × 45).

## Interaction state (per portal)

- Marketing: login dropdown open/close; wizard `step 0..5` + `submitted` +
  selection sets (branches, subjects, slots) + validation.
- Admin: tab = route; master-detail = route param; enquiry filter
  (all/new/pending/week); billing filter (all/paid/pending/overdue); syllabus
  stage + subject; assign-class modal open/close (backdrop closes, inner
  stopPropagation).
- Tutor: tab = route; class detail = route param; `att` map keyed
  `classId|studentName → present|late|absent` (default present); summary counts
  recompute live; Set semula resets; Simpan sets saved.

## Cross-cutting

- Fake auth = portal/role switcher via the Log Masuk dropdown + the demo
  watermark (fixed bottom-left, links to axelnovaventures.com).
- Copy conventions: sentence case, no em dashes, warm tone, bilingual where the
  prototype is. Reproduce prototype copy verbatim (BM-primary on marketing).
- Mobile-first responsive: sidebars collapse to a sticky horizontal nav on
  small screens; grids reflow; tables get horizontal scroll wrappers.

## Build order

1. **Foundation (sequential):** scaffold Nuxt 4 + deps → `config/academy.ts` →
   `main.css` `@theme` tokens + fonts + keyframes → `types/` → seeded
   `stores/academy.ts` (internally consistent, payroll reconciles) →
   `composables/` seam → layouts + portal shells (sidebar/topbar) + shared
   `ui/` components → copy `CLAUDE.md` to root. Verify `npm run dev` boots and
   all four portals are reachable.
2. **Admin HERO:** dashboard → students (+detail) → educators (+detail) →
   schedule (+modal) → billing. Syllabus (supporting). Payroll/Branches/Settings
   stubs.
3. **Tutor HERO:** dashboard → jadual → kelas (+attendance detail) → pendapatan.
   Rancangan (supporting).
4. **Marketing + registration + parent teaser**, with GSAP/Lenis motion.
5. **Polish pass:** mobile QA, demo watermark, cross-portal links, payroll
   reconciliation check, accessibility sweep (focus states, alt text, reduced
   motion).

Independent screens within a stage may be built by parallel subagents once the
data seam exists, since they share no mutable state and touch disjoint files.

## Out of scope (explicit)

No backend, API, or real auth library. No live financial calc wired to inputs.
No multi-tenancy plumbing. No fonts/hues beyond the tokens. No data inlined in
components. Parent portal beyond the single teaser. Full national KPM syllabus
(only a convincing slice).

## Verification

- `npm run dev` boots clean; all routes reachable from the Log Masuk dropdown
  and direct URL.
- Payroll invariant: tutor dashboard / tutor Pendapatan / admin Educators /
  admin Payroll all show RM 1,710 for Cikgu Hafiz, recomputed from sessions.
- Attendance screen: marking flows, live counts, save-label flip all work.
- Registration: validation gates advance correctly; submit → confirmation.
- No component imports the store or seed data directly (composables only).
- Re-skin smoke test: changing `config/academy.ts` name/branches updates the UI
  with no other edits.
