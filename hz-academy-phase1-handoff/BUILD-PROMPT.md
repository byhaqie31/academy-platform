# Build prompt — phase 1 marketing surface

Paste this into Claude Code with the `academy-platform` repo open. The design references live in
`design/` in this bundle. Read `CLAUDE.md` and `docs/superpowers/PROJECT-CONTEXT.md` first.

---

## What you are building

Three things, all inside the existing Nuxt 4 app, all client-facing, all Malay-primary:

1. **A six-page website** replacing today's single-page marketing site.
2. **A landing page system**: one template plus a dynamic route, driven by per-campaign data files,
   with two real campaigns shipped as examples.
3. **A separated portal login**, moved out of the site header onto its own route.

Static reference implementations are in `design/`. Open them in a browser first. They are the
approved design, built at 1440px and 390px, both verified free of horizontal overflow.

- `design/website.html` — all six pages, click the nav to switch
- `design/lp-matematik-spm-ogos.html` — landing page, Menengah Atas audience
- `design/lp-matematik-rendah-ogos.html` — landing page, Sekolah Rendah audience
- `design/src/*.template.html` — the same files without the base64 fonts, easier to read

**Treat those files as a visual and structural specification, not as code to copy.** They are
standalone HTML with inline styles and hardcoded hex. The repo has a design system. Port the design,
not the markup.

---

## Non-negotiable repo rules

These come from `CLAUDE.md` and they override any instinct from the reference HTML.

1. **Never write a raw hex colour.** Every colour already exists as an OKLCH token in
   `app/assets/css/main.css`. Mapping table below.
2. **Never inline data in a component.** All data goes through a composable in `app/composables/`,
   which reads from the seeded Pinia store. This includes landing page content.
3. **Centre identity comes from `config/academy.ts` only.** Name, WhatsApp number, email, tagline.
   Nothing should hardcode "Hz Academy" or the phone number.
4. **Copy conventions.** Sentence case everywhere, no title case headers. **No em dashes**, use
   commas, periods, or "to" for ranges. Marketing surfaces are **Malay primary**.
5. **Fonts are already wired** by `@nuxt/fonts`: Plus Jakarta Sans as `--font-sans`, Fredoka as
   `--font-display` via the `.font-display` class. Delete the `@font-face` blocks from the reference
   HTML entirely.
6. **No new dependencies** without asking. Everything below is buildable with what is installed.
7. **Marketing motion only.** GSAP and Lenis stay on marketing surfaces. Never on portal screens.

### Colour token mapping

| Reference hex | Use this token |
|---|---|
| `#8B6CF0` | `--color-brand` |
| `#6B4BD6` | `--color-brand-deep` |
| `#FF7AA8` | `--color-accent-pink` |
| `#FFA45C` | `--color-accent-orange` |
| `#3DA5F4` | `--color-accent-blue` |
| `#1E2348` | `--color-ink` |
| `#4A4F76` | `--color-text-body` |
| `#6B7194` | `--color-ink-soft` |
| `#E9E5F8` | `--color-border` |
| `#F6F4FF` | `--color-surface-lavender` |
| `#FFF4F8` | `--color-tile-rose` |
| `#E8FAF0` / `#1E8A54` | `--color-tile-green` / `--color-fg-green` |
| `#EAF4FE` / `#1E7FD0` | `--color-tile-blue` / `--color-fg-blue` |
| `#25D366` | `--color-whatsapp` |
| pill radius `999px` | `--radius-pill` |
| tile radius `13px` | `--radius-tile` |

The reference cards use a 22px radius, which has no token yet. **Add one token**
(`--radius-card: 22px`) to the `@theme` block rather than writing the value inline.

---

## Part 1 · The six-page website

### Routes to create

| Route | File | Job |
|---|---|---|
| `/` | `app/pages/index.vue` *(modify)* | What Hz is now, who it is for |
| `/subjek` | `app/pages/subjek.vue` | Subjects grouped by KPM stage |
| `/cara-ia-berfungsi` | `app/pages/cara-ia-berfungsi.vue` | How an online class runs. This page kills the biggest objection |
| `/guru` | `app/pages/guru.vue` | Tutors. Trust in an online centre lives here |
| `/yuran` | `app/pages/yuran.vue` | Fees, stated plainly |
| `/hubungi` | `app/pages/hubungi.vue` | WhatsApp first, form second |

All six use `definePageMeta({ layout: 'marketing' })`.

### Changes to the existing marketing layer

- **Delete `BranchGrid` from `app/pages/index.vue`.** Hz is fully online now. The component file can
  stay for other centres, but nothing on the site renders it.
- **Remove `LoginDropdown` from `SiteHeader.vue`.** See Part 3. A cold visitor arriving from an ad
  should not be shown a login form.
- **Update `SiteHeader.vue`** to carry the six nav items plus one primary CTA ("Daftar minat").
  Mobile collapses to a burger menu.
- **Update `SiteFooter.vue`** to add an "Ibu bapa sedia ada" column containing the quiet portal link.
- **`RegistrationWizard.vue` drops from 6 steps to 5.** Remove the branch selection step. New order:
  guardian, student, subjects by KPM level, preferred schedule, review.

### New components

Put these in `app/components/marketing/`:

- `SubjectsByStage.vue` — subjects grouped into Sekolah Rendah, Menengah Rendah, Menengah Atas
- `HowItWorksDetail.vue` — the long-form explanation, with the "what you need" panel
- `TutorGrid.vue` — tutor cards with initial-avatar, name, subject, experience
- `FeeTable.vue` — per-stage fee table plus the discount and payment notes
- `ContactPanel.vue` — WhatsApp block, hours, email
- `EnquiryForm.vue` — name, phone, stage, subjects, **unticked consent checkbox**
- `FaqAccordion.vue` — reusable, takes an array of question and answer pairs

### Data

**None of this content may be hardcoded in a component.** Extend the seeded store and expose it:

- `useSubjects()` already exists. Extend it to return subjects grouped by stage
  (`'rendah' | 'mr' | 'ma'`), with a per-stage label and the levels each subject runs at.
- `useEducators()` already exists. Add a `publicProfiles` accessor returning only the fields the
  public site should show: name, subjects, years teaching, one line of description. **Never expose
  hourly rate or accumulated hours to a marketing page.**
- Add `useFees()` — per-stage monthly fee, what is included, discount rules. Derived, read-only.
- Add `useFaqs()` — keyed sets, so the same composable serves both the website and the landing pages.

Every new composable carries the standard comment:
`// swap internals for API calls when backend lands; signature stays stable`

---

## Part 2 · The landing page system

**This is the real deliverable of phase 1.** Not two landing pages, a system that produces them.

### The rule that defines a landing page

**No navigation.** No header menu, no footer link farm, one exit. A menu on a landing page typically
costs 10 to 30 percent of conversions because it hands a visitor who was about to enquire somewhere
else to click. The masthead shows the logo only, and it is not a link.

Create `app/layouts/landing.vue` for this. It must not import `SiteHeader`.

### Route

`app/pages/lp/[slug].vue` — resolves the slug against the campaign data, renders the template, and
throws a 404 for an unknown slug.

### Campaign data

The phase 1 spec calls for content files with frontmatter. `@nuxt/content` is **not installed**, and
adding it is not worth a dependency for this. Use typed modules instead, which also keeps the data
seam intact:

```
app/content/landings/ma-matematik-ogos.ts
app/content/landings/rendah-matematik-ogos.ts
app/content/landings/index.ts        // registry, slug -> campaign
```

Accessed through a new `useLandings()` composable, never imported directly by a component. When
`@nuxt/content` or a CMS arrives later, only the composable internals change. That is the same
principle the rest of the repo follows.

Add a `LandingCampaign` type to `app/types/index.ts`. Two ready-made campaign files are in
`content/` in this bundle — use them as the shape and as the two shipped examples.

### Section order, in this order

1. **Hero** — pills, headline naming the exact audience and outcome, sub-headline, primary CTA plus
   WhatsApp, micro-proof stats, and the offer card on the right
2. **Trust strip** — dark band, four claims
3. **Proof** — three testimonials with faces
4. **How it works** — four steps
5. **What is included** — checklist beside a repeated CTA
6. **The offer** — dark band, strike-through price, the free trial
7. **Objections** — five questions as an accordion
8. **Final CTA** — form with the WhatsApp option beside it, and the consent checkbox

The **same CTA wording repeats three to four times** down the page. Do not vary it.

### Naming convention, enforce it

```
<level>-<subject>-<campaign>        e.g.  ma-matematik-ogos
```

The same string is the file name, the slug, the Pixel `content_name`, the UTM campaign value and the
enquiry tag. One string end to end means the ad platform and the enquiry list agree without anyone
reconciling by hand. Validate it in the type.

---

## Part 3 · Separate the portal login

Currently `LoginDropdown.vue` sits in the site header. That conflates two products.

- **Create `app/pages/portal/masuk.vue`** — a standalone login page with its own minimal layout, not
  the marketing layout. Logo, one heading, phone number field, a "Hantar pautan ke WhatsApp" button,
  and one line explaining that no password is needed. Malay primary, plain language.
- **Remove `LoginDropdown` from `SiteHeader.vue`.**
- **Add a quiet link in `SiteFooter.vue`** under an "Ibu bapa sedia ada" heading, pointing to
  `/portal/masuk`.
- Keep the existing portal role-switcher available for demos, but **not on the public header**. If
  you need it for the click-through, put it behind `DemoWatermark` or a query parameter.

The intent: phase 1 stays a fully static marketing build with no authentication anywhere. The portal
is a phase 2 product that happens to have a door on the same domain.

---

## Acceptance criteria

- [ ] Six website routes render, Malay primary, `marketing` layout, no branch content anywhere
- [ ] `/lp/ma-matematik-ogos` and `/lp/rendah-matematik-ogos` render from their data files
- [ ] Neither landing page renders any navigation, and the logo is not a link
- [ ] **Adding a third campaign requires only a new file in `app/content/landings/` plus a registry
      entry.** No component edits. Demonstrate this by adding a throwaway third campaign, confirming
      it renders, then deleting it
- [ ] No raw hex colour anywhere in the diff. `grep -rE "#[0-9a-fA-F]{6}" app/` returns nothing new
- [ ] No component imports the Pinia store or a seed array directly
- [ ] Registration wizard is 5 steps, no branch step
- [ ] `LoginDropdown` no longer appears in the site header; `/portal/masuk` exists
- [ ] Consent checkbox present and **unticked by default** on both the website form and the landing
      form
- [ ] `npm run typecheck` and `npm run test` both pass
- [ ] No horizontal scroll at 390px on any route
- [ ] `npm run generate` completes and the static output serves correctly

---

## Do not

- Do not add a backend, an API call, a real auth library, or a payment integration. Phase 1 is static.
- Do not build the quiz. It is separately quoted and comes much later.
- Do not add tracking code yet. The Pixel and Conversions API work is a separate task with its own
  spec, and doing it half-way is worse than not doing it.
- Do not add branch or cohort selection to any new screen.
- Do not restyle the admin or tutor portals. This task touches marketing surfaces only.
- Do not copy the inline `<style>` blocks from the reference HTML.

---

## Suggested order

1. Token additions and `SiteHeader` / `SiteFooter` changes, so the shell is right first
2. The six website pages, home last since it reuses the most components
3. `landing` layout, `LandingCampaign` type, `useLandings()`, the dynamic route
4. The two campaign files, then the add-a-third test
5. Portal login route and the header removal
6. Registration wizard 6 to 5
7. Typecheck, tests, mobile pass, static build
