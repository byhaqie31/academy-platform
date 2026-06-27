# Academy Platform

**A management platform for Malaysian tuition centres.**
Admin, tutor, and parent portals in one place, built around the KPM syllabus and local payment rails.

A product by Axel Nova Ventures. Simple, effortless, human.

> **Working name.** "Academy Platform" is the internal name. The customer-facing brand is still to be decided and lives only in `config/academy.ts`, so it can change without touching code.

---

## What this is

Academy Platform replaces the spreadsheet, WhatsApp, and Google Calendar patchwork that most Malaysian tuition centres run on. One system for the whole centre: enquiries, students, tutors, classes, schedules, attendance, billing, and hourly tutor payroll.

This repository currently holds the **frontend mockup**, a clickable, no-backend prototype used to validate the product with our first design-partner centre. It is built in the production stack so nothing gets thrown away when the backend arrives.

Design partner number one: Pusat Tuisyen Hz Academy.

---

## Why local-first

International tuition platforms exist, but they do not speak Malaysian. This product is built around the things a local centre actually needs, which are the same things a foreign product cannot easily copy:

- **KPM syllabus alignment.** Subjects and levels modelled on the real Malaysian curriculum: Sekolah Rendah, Menengah Rendah and Atas, with STEM and TVET streams.
- **Local payment rails.** FPX and DuitNow for student billing, not just cards.
- **LHDN e-Invoice on the roadmap.** Built to meet Malaysia's e-invoicing requirements as they roll out.
- **WhatsApp-native.** Enquiry and follow-up flows that fit how parents already communicate.

---

## The four portals

| Portal | For | What it does |
|---|---|---|
| **Marketing** | Parents from ads | Converts ad traffic into structured enquiries, Meta Pixel and WhatsApp funnel |
| **Admin** | Owner and office staff | Students, tutors, schedule and lesson plans, student billing, tutor payroll |
| **Tutor** | Educators | Daily dashboard, classroom and attendance, syllabus, payslip generation |
| **Parent / student** | Families | Attendance, payments, schedule, feedback, learning materials *(planned)* |

The admin and tutor portals are the core. The parent portal is mapped in the data model but built later.

---

## Tech stack

- **Nuxt 4** (Vue 3, `<script setup lang="ts">`), SPA / static for the mockup
- **Tailwind v4**, CSS-first with OKLCH tokens in `@theme`
- **@nuxt/ui v4** for tables, forms, and dashboard primitives
- **Pinia** for state, holding seeded demo data
- **TypeScript** entity types for every domain object
- Fonts: Plus Jakarta Sans and Fredoka (warm education theme)
- Marketing page only: GSAP and Lenis for motion

### The data seam (read this before adding a screen)

All demo data is served through composables, never inlined in components:

```
useStudents()   useEducators()   useSchedule()   usePayroll()  ...
```

Today these return seeded fake data from a single typed store. When the backend exists, only the inside of each composable changes to call the API. Components stay untouched. This is what makes frontend-first work non-disposable, so keep to it.

---

## Status and roadmap

**Now: frontend mockup (this repo).** Full SHOW, phased SELL. We mock the complete vision so a buyer can click the dream, but the build ships in phases.

| Phase | Scope |
|---|---|
| 1 | Marketing page, Meta Pixel, WhatsApp enquiry funnel |
| 2 | Student registration and core admin (students, enquiries) |
| 3 | Full admin: schedule, lesson plans, billing, tutor payroll |
| 4 | Tutor portal |
| 5 | Parent / student portal and learning materials |

**Later: real backend.** Laravel 11, MySQL, FPX/DuitNow via Billplz, deployed through the existing GHCR to VPS pipeline. The frontend in this repo becomes the frontend of the product, unchanged behind the composable seam.

---

## Getting started

```bash
npm install        # install
npm run dev        # run the mockup locally
npm run generate   # build static
```

No environment variables and no backend are required for the mockup. All data is seeded.

---

## Project structure

```
app/
  pages/
    index.vue            # marketing page
    admin/               # admin portal screens
    tutor/               # tutor portal screens
    parent/              # parent portal (teaser for now)
  components/            # shared UI, namespaced per portal
  composables/           # the data seam: useStudents, usePayroll, ...
  stores/                # Pinia, seeded demo data
  types/                 # TypeScript entity interfaces
  assets/css/            # Tailwind v4 theme, OKLCH tokens
config/
  academy.ts             # branding and tenant config (see below)
```

---

## Branding config (keep it generic)

This is one product serving many centres. The first one is Hz Academy, but nothing about Hz is hardcoded. Academy name, logo, palette, and branch list live in a single config object:

```ts
// config/academy.ts
export const academy = {
  name: "Hz Academy",
  tagline: "Trusted tuition since 2014",
  branches: ["Kota Warisan Sepang", "Taman Sutera Kajang", "Taman Ixora", "Pekan"],
  // theme tokens, logo, contact ...
}
```

Re-skinning for the next centre is a config edit, not a refactor. This is a thin theming seam only. Real multi-tenancy (owner scoping, per-tenant billing) comes later, when there is real demand for it.

---

## License and ownership

Private. Product IP owned by Axel Nova Ventures.

---

*Built by Qie / Axel Nova Ventures · Simple, effortless, human. · baihaqie@axelnova.tech · axelnovaventures.com*
