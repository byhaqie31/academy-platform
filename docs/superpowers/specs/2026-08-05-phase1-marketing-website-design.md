# Phase 1 marketing website (spec A of two)

Date: 2026-08-05
Status: approved, in implementation
Source: `hz-academy-phase1-handoff/BUILD-PROMPT.md` + `design/website.html`

## Goal

Replace the single-page marketing site with a six-page Malay website, freeze the current mockup as
a browsable v1 archive, split the portal login out of the site header, and drop the registration
wizard from six steps to five.

The landing page system (`/lp/[slug]`, `useLandings()`, campaign data files) and the `/demo`
directory page are **spec B**. They are not built here.

## Decisions taken during brainstorming

### 1. Language: Malay for reading, English for structure

The handoff is Malay-primary. The `2026-07-09` spec had just made the whole app English-primary.
Those are not actually in conflict once the line is drawn in the right place, because that spec
listed the marketing audience shift as an explicit non-goal. The marketing surface still sells to
Malay-speaking parents; the portals are product chrome.

- **Malay:** everything a visitor reads on `/`, `/subjects`, `/how-it-works`, `/tutors`, `/fees`,
  `/contact`, `/portal/login`, and later `/lp/*`.
- **English:** routes, filenames, component names, types, composables, props, store keys, comments,
  test names, commit messages.
- **Unchanged:** admin and tutor portals stay English.

Three consequences, each a trap if left implicit:

- `academy.motto` **stays English**. The reference footer prints "Simple, effortless, human."
  verbatim, so it is not a translation candidate.
- `academy.tagline` is rendered nowhere today (typed in `app/types/academy.ts`, set in
  `config/academy.ts`, referenced by no component). It stays as-is rather than being retranslated
  speculatively.
- Malaysian domain data stays Malay, as `CLAUDE.md` already requires: subject names, Tahun and
  Tingkatan levels, class names, person names, branch names.

`CLAUDE.md` copy conventions is amended from "English throughout the UI" to this split. Leaving it
would make the next session undo this work.

### 2. URLs are English, campaign slugs are mixed

Public paths are structure, so they are English. Campaign slugs (spec B) become
`ma-matematik-august` and `rendah-matematik-august`: `matematik` survives because `CLAUDE.md` rules
KPM subject names are proper nouns, `ogos` becomes `august` because the English pass already
translated month names.

Nothing is locked yet, no Pixel, no UTMs, no live ads, so renaming costs nothing today and would
cost real money after launch.

### 3. v1 is a frozen copy inside the same build

The new home page is a restyle of the same components, so any shared component would silently drag
v1 into Malay. v1 therefore gets its own copies, taken **before the first Malay string lands**.

```
app/pages/v1/index.vue     archived home page, definePageMeta layout 'v1'
app/layouts/v1.vue         frozen shell
app/components/v1/         frozen: SiteHeader SiteFooter Hero TrustStrip SubjectGrid
                           BranchGrid HowToSteps Testimonials WhyChooseUs CtaBanner
                           FloatingWhatsApp LoginDropdown
```

**Rule: v1 imports only from `~/components/v1/`, `~/components/ui/`, and `~/composables/`.**

- `~/components/ui/` is shared deliberately. `AppButton`, `LogoMark`, `IconTile` and
  `SectionHeading` take slots and carry no copy, so they cannot drift v1's language.
- Composables are shared deliberately. They are the data seam; forking them would fork the store.
  **Accepted consequence:** if seed data changes later, v1's numbers move with it. v1 archives the
  design, not the data.

Duplication is normally wrong. An archive snapshot is the case where it is right, because the whole
point is that it stops tracking live code. These twelve files are copied once and never edited.

`/v1` is reachable only from `/demo` (spec B). Nothing on the public site links to it.

### 4. Branches leave marketing only

Hz is fully online, so `BranchGrid` leaves the home page and the branch step leaves the wizard.
`config/academy.ts` keeps all four branches and the admin portal keeps rendering them, per the
handoff's "do not restyle the portals" rule.

**Accepted seam:** clicking from the online-only site into the admin dashboard shows four physical
branches. The demo answer is that the platform supports branches for centres that have them.

### 5. Fees, seat counts and testimonials are illustrative

RM 120 / 150 / 180, the seat counts, and the tutor names and testimonials are placeholder data, as
the handoff README states. They ship flagged, not confirmed by Hz.

## Route map

| Route | File | Nav label | Job |
|---|---|---|---|
| `/` | `pages/index.vue` *(modify)* | Laman utama | What Hz is now, who it is for |
| `/subjects` | `pages/subjects.vue` | Subjek | Subjects grouped by KPM stage |
| `/how-it-works` | `pages/how-it-works.vue` | Cara ia berfungsi | How an online class runs |
| `/tutors` | `pages/tutors.vue` | Cikgu | Where trust in an online centre lives |
| `/fees` | `pages/fees.vue` | Yuran | Fees, stated plainly |
| `/contact` | `pages/contact.vue` | Hubungi | WhatsApp first, form second |
| `/register` | *unchanged* | Daftar minat *(CTA)* | Wizard, now 5 steps |
| `/portal/login` | `pages/portal/login.vue` | *footer only* | Own minimal layout |
| `/v1` | `pages/v1/index.vue` | *demo only* | Frozen archive |

All six website routes use `definePageMeta({ layout: 'marketing' })`.

## Shell

**`SiteHeader`** — logo, six nav items, primary CTA "Daftar minat", WhatsApp button. Burger below
`md`. `LoginDropdown` removed.

**`SiteFooter`** — four columns: brand blurb, Akademi (the six links plus Daftar minat), Hubungi
(WhatsApp and email), and "Ibu bapa sedia ada" carrying "Log masuk portal →". Branches column
deleted.

Nav items are data, so they come from a new `useSiteNav()` rather than being inlined.
`usePortalNav.ts` is left alone: marketing is not a portal.

## Tokens

Add to the `@theme` block in `app/assets/css/main.css`:

- `--radius-card: 22px` (the handoff's card radius, which has no token yet)
- `--color-footer-text` for `#9CA0BE`
- `--color-footer-faint` for `#6F739A`

The last two are not new hues; they are existing raw hex in `SiteFooter.vue` being tokenised as
part of that file's rewrite. `#34C77B` in the same file is already `--color-whatsapp-soft`.

**Correction to the handoff's mapping table:** it maps `#FFA45C` to `--color-accent-orange`, but
that token is `#FFA94D`. Reuse it. Adding a near-duplicate hue would violate the no-new-hues rule
for a difference nobody can see.

## Data seam

No content is hardcoded in a component. Everything below is seeded in `app/stores/academy.ts` and
read through a composable carrying the standard comment
`// swap internals for API calls when backend lands; signature stays stable`.

| Composable | Change | Serves |
|---|---|---|
| `useSubjects()` | add `byStage` returning `rendah`/`mr`/`ma` groups with stage label and per-subject levels | `/subjects` |
| `useEducators()` | add `publicProfiles`: name, subjects, years teaching, one line of description | `/tutors` |
| `useFees()` | **new.** Per-stage monthly fee, what is included, discount and payment notes | `/fees` |
| `useFaqs()` | **new.** Keyed sets, so the same composable serves the website and spec B's landings | `/how-it-works`, `/contact` |
| `useSiteNav()` | **new.** Marketing nav items and footer columns | shell |

`publicProfiles` must **never** expose `rate` or accumulated `hours`. Those are payroll fields and
this is a public page.

## New components

In `app/components/marketing/`:

`SubjectsByStage.vue`, `HowItWorksDetail.vue`, `TutorGrid.vue`, `FeeTable.vue`, `ContactPanel.vue`,
`EnquiryForm.vue`, `FaqAccordion.vue`.

`FaqAccordion.vue` takes an array of question and answer pairs as a prop, so spec B reuses it
unchanged.

## Existing components

Retranslated to Malay and restyled to the reference: `Hero`, `TrustStrip`, `SubjectGrid`,
`HowToSteps`, `Testimonials`, `CtaBanner`.

Dropped from the home page: `BranchGrid` (Hz is online), `WhyChooseUs` (not in the reference home).
Both files stay on disk for other centres, and both are already frozen into `app/components/v1/`.

Home page order matches the reference: hero, trust strip, subjects, four steps, testimonials, CTA.

## Portal login

- `app/layouts/portal-auth.vue` — minimal shell, no `SiteHeader`, no marketing motion.
- `app/pages/portal/login.vue` — logo, one heading, phone number field, a "Hantar pautan ke
  WhatsApp" button, one line explaining no password is needed. Malay, plain language.
- No auth library, no real submit. Phase 1 stays fully static.

The existing role-switcher stays available for demos but leaves the public header.

## Registration wizard

Six steps to five. The branch selection step is removed. New order: guardian, student, subjects by
KPM level, preferred schedule, review. Copy goes Malay.

`app/utils/validation.ts` and `test/utils/validation.spec.ts` are checked for a branch assertion; if
one exists it is removed with the step.

## Consent

Both `EnquiryForm.vue` and the wizard carry a consent checkbox, **unticked by default**.

## Verification

Evidence required before claiming completion:

1. `npm run typecheck` passes.
2. `npm run test` passes.
3. `grep -rE "#[0-9a-fA-F]{6}" app/` returns no *new* hex. Pre-existing hex outside the touched
   files is out of scope; hex inside `app/components/v1/` is frozen archive and is expected.
4. No component imports `~/stores/academy` or a seed array directly.
5. All nine routes render, including `/v1`.
6. No horizontal scroll at 390px on any route.
7. `npm run generate` completes.

## Out of scope

Landing page system, `/demo` directory, tracking code, the quiz, backend, auth, payments, portal
restyling, branch or cohort selection on any new screen.
