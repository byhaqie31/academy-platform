# CLAUDE.md — Academy Platform

Persistent context for Claude Code. Read this before any task in this repo.

## What this is
A frontend-only mockup of a management platform for Malaysian tuition centres. Working name "Academy Platform", customer-facing brand to be decided (lives only in `config/academy.ts`). First design-partner centre: Hz Academy.

This is a sales and validation prototype. There is no backend. All data is seeded fake data. Optimise for demo clarity and a convincing click-through, not production patterns.

## Governing principles
1. **Full SHOW, phased SELL.** Mock the complete four-portal vision so a buyer can click the dream, but understand the real build ships in phases. Build the screens that sell first.
2. **Mock what sells, stub the rest.** Screens are tiered HERO, SUPPORTING, STUB. Only HERO screens get full fidelity and fake interactivity. SUPPORTING are lighter. STUB are titled, styled placeholders that say the feature exists.
3. **The data seam is sacred.** All data is accessed through composables (`useStudents()`, `usePayroll()`, etc.) that read from one seeded Pinia store. Never inline data in components. When a backend exists later, only composable internals change. This is what stops the mockup from being throwaway.
4. **Stay generic.** Hz Academy is configured-instance-one, not hardcoded. Name, logo, palette, and branches come from `config/academy.ts`. Re-skinning for the next centre must be a config edit, not a refactor. This is theming only, not multi-tenancy. Do not build owner-scoping or per-tenant billing.
5. **Money is handled with care.** Tutor payroll and student billing show pre-computed output. Do not build live financial calculation logic in the mockup. Payroll rules get validated in plain language with the owner before any real implementation.

## Tech stack
- Nuxt 4 (`app/` directory), Vue 3, `<script setup lang="ts">`, TypeScript
- SPA or static (no server routes needed)
- @nuxt/ui v4 (brings Tailwind v4) for tables, forms, modals, dashboard primitives
- Tailwind v4 CSS-first, theme tokens as OKLCH in `@theme`
- Pinia for the seeded data store
- Fonts: Plus Jakarta Sans (body), Fredoka (display)
- GSAP + Lenis on the marketing page only. Dashboards stay calm and fast, no animation.

## Design system (Hz theme, lives in config/tokens)
Warm, friendly education brand. Rounded pills (radius 999px), rounded cards (~15px), soft shadows, 1px tint borders.

Source palette (convert to OKLCH in `@theme`):
- brand `#8B6CF0`, brand-deep `#6B4BD6`
- accent-pink `#FF7AA8`, accent-blue `#3DA5F4`
- ink `#1E2348`, ink-soft `#5B6080`, muted `#8388A5`, faint `#A0A4B8`
- border `#ECEAF4`, border-strong `#E6E2F2`
- tint-purple `#FBF8FF` / `#F1ECFF`, tint-pink `#FFF4F8` / `#FFE6F0`, tint-blue `#EAF3FF` / `#F2F8FF`, tint-green `#E8F7EE`
- whatsapp `#25D366`, surface `#FFFFFF`, selection `#FFD3E2`

## Copy conventions
- Sentence case everywhere. No title case headers.
- No em dashes. Use commas, periods, or "to" for ranges.
- Bilingual where natural: English label with a smaller Malay sub-label.
- Warm, non-corporate tone. Tagline: "Simple, effortless, human."

## Data model (the spine)
Core entities, all typed in `types/`:
Branch, Guardian, Student, Educator, Subject, Class, LessonPlan, Attendance, Session, Invoice, PayrollRun, Feedback.

Two relationships that must stay consistent:
- A **Session** has a duration. A tutor's pay for a period is the sum of their session durations times their hourly rate. Derive it, never hand-enter it. The "estimated pay this month" on the tutor dashboard MUST equal what the admin payroll screen computes from the same sessions.
- A **Class** ties Subject + Educator + Branch + Schedule + Students. Most screens are a view onto Class from a different angle.

Seed realistic Malaysian data: real-format names, IC numbers, RM amounts, the four Hz branches (Kota Warisan Sepang, Taman Sutera Kajang, Taman Ixora, Pekan), and KPM-flavoured subjects.

## Portals and screen tiers
**Marketing** — ad conversion page, Meta Pixel, WhatsApp funnel. (port from existing mockup later)

**Admin** (the meeting-winner)
- HERO: Dashboard, Students & guardians (+ detail), Educators (+ detail), Schedule & lesson plans, Student billing
- SUPPORTING: Syllabus / e-learning tree, Tutor payroll output
- STUB: Branches, Audit log, Settings & integrations (Zoom / Microsoft / WhatsApp toggles)

**Tutor** (the stickiness)
- HERO: Onboarding, Dashboard, Classroom (+ student detail), Salary & payslip
- SUPPORTING: My syllabus

**Parent / student** — one teaser screen only. Everything else stubbed. Do not build until admin and tutor close a deal.

## KPM syllabus
Stages: Sekolah Rendah (Tahun 1 to 6), Menengah Rendah (Tingkatan 1 to 3), Menengah Atas (Tingkatan 4 to 5). Show core subjects (BM, BI, Matematik, Sains, Sejarah, Geografi) plus STEM and TVET as categories. Populate a convincing slice with authentic topic names. Do not build the full national syllabus in the mockup.

## Integrations
Zoom and Microsoft are integration stubs (a "Join class" button, a settings toggle), never custom-built video. Keep them clearly in the integration column, not the build column.

## What NOT to do
- No backend, no API calls, no real auth library. Fake auth is a portal/role switcher.
- No live financial calculations wired to inputs.
- No multi-tenancy plumbing.
- No new fonts or hues beyond the tokens above.
- No data inlined in components, ever. Go through composables.

## Build sequence
0. Foundation: scaffold, theme tokens, types, seeded store, composable seam, academy config, portal shells and nav.
1. Admin dashboard + Students.
2. Tutor dashboard + payslip.
3. Schedule + Classroom (ties admin and tutor together).
4. Billing + payroll output.
5. Parent teaser.
6. Polish, mobile pass, demo watermark, login split.

Work in stages with a checkpoint after each. Report and wait for go-ahead before moving to the next stage.
