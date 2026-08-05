# Phase 1 campaign landing pages (spec B of two)

Date: 2026-08-05
Status: built
Source: `hz-academy-phase1-handoff/BUILD-PROMPT.md` + `design/lp-*.html`
Companion: `2026-08-05-phase1-marketing-website-design.md` (spec A)

## Goal

Not two landing pages. **A system that produces them.** A third campaign must be a
new data file plus a registry line, with no component edit. There is an acceptance test for
exactly that.

## The rule that defines a landing page

**No navigation.** No header menu, no footer link farm, one exit. A menu on a landing page
typically costs 10 to 30 percent of conversions, because it hands a visitor who was about to
enquire somewhere else to click.

`app/layouts/landing.vue` never imports `SiteHeader` or `SiteFooter`. The masthead is a logo and
it is **not** a link, deliberately not a `NuxtLink`: making it one is the easy mistake that quietly
reopens the exit.

Enforced by test, not by good intentions: the browser check asserts zero `<nav>`, zero `<header>`,
zero internal links and an unlinked logo on every campaign page.

### The one deliberate exception

`DemoNav`, the prototype screen switcher, **does** appear on landing pages. Decided knowingly: this
build is a client walkthrough, and being stranded on a campaign page with no way back is worse, for
someone clicking around, than the rule it bends.

It is a second exit, and that is exactly what the rule forbids. So it is behind one flag rather than
scattered through the template:

```ts
// app/components/ui/DemoNav.vue
const SHOW_ON_LANDING = true   // set false before real ad traffic
```

**Before any campaign page takes live traffic, set it to `false`.** This is the kind of thing that
quietly ships and costs conversions, which is why it is one edit and why it is written down here.

## Architecture

```
app/content/landings/ma-matematik-august.ts       campaign data
app/content/landings/rendah-matematik-august.ts   campaign data
app/content/landings/index.ts                     registry, slug -> campaign
app/composables/useLandings.ts                    the seam
app/layouts/landing.vue                           no-navigation shell
app/pages/lp/[slug].vue                           one template, every campaign
app/components/landing/                           LandingHero, LandingOffer,
                                                  LandingIncluded, LandingFinalCta
```

**Typed modules, not `@nuxt/content`.** Adding a content pipeline is not worth a dependency for six
files, and typed modules keep the data seam intact and the types checked. Components never import
the registry; they go through `useLandings()`. When a CMS arrives, only that composable changes.

**Four new components, not eight.** The trust strip, proof, steps and objections sections reuse
`Testimonials`, `StepCards`, `FaqAccordion` and `CheckList` from spec A, which already took their
content as props. That was the point of building them that way.

## Slug convention

```
<level>-<subject>-<campaign>     e.g. ma-matematik-august
```

The same string is the file name, the route slug, the Pixel `content_name`, the UTM campaign value
and the enquiry tag. One string end to end means the ad platform and the enquiry list agree without
anyone reconciling by hand.

Validated in two layers, because one is not enough:

- `LandingSlug` is a template literal type, `` `${Stage}-${string}-${string}` ``, which enforces the
  shape.
- `test/content/landings.spec.ts` asserts the slug's parts equal the campaign's own `level`,
  `subject` and `campaign` fields. A type cannot check that.

## Shared pools, keyed

A campaign names what it wants rather than restating it:

| Pool | Lives in | Referenced by |
|---|---|---|
| FAQs | `siteContent.faqs` | `campaign.faqs: string[]` |
| Testimonials | `siteContent.siteTestimonials` | `campaign.proof.testimonials` |
| Hero stats | `siteContent.landingStats` | `campaign.proof.stats` |

`useLandings().resolve()` turns those keys into objects. **Unknown keys are dropped, not thrown**: a
typo in a campaign file should cost one card, not the whole page. The spec test is what catches the
typo, so the failure is loud at build time and quiet at runtime.

Two audiences need different reassurance, so the pools carry both. An SPM parent asks "is this
effective"; a Tahun 4 parent asks "can a nine year old do this at all". Hence
`can-young-child-learn-online`, `must-parent-sit-in`, and the `-rendah` testimonial set.

## Section order

Hero (pills, headline, sub, CTA + WhatsApp, micro-proof, offer card) → trust strip → proof →
how it works → what is included → the offer → objections → final CTA.

**The same CTA wording repeats, unvaried.** Both shipped campaigns render it five times. Varying it
is a common instinct and a mistake: it reads as several different asks rather than one.

## Unknown slug

`createError({ statusCode: 404, fatal: true })`. A mistyped ad URL should fail loudly while the
campaign is still cheap to fix, not render an empty page that quietly burns ad spend.

## Illustrative data

Prices (RM 180 / RM 120) and seat counts (13 of 18, 11 of 16) are placeholders, as the handoff
README states. **Scarcity only works if it is true**, so the seat counts in particular must be real
before either page runs as an ad.

## Verification

Evidence required, all of it gathered in a browser against the built output:

1. `npm run typecheck` and `npm run test` pass. 43 tests, 18 of them landing specs.
2. Both campaigns render every one of the eight sections.
3. Zero `<nav>`, zero `<header>`, zero internal links, logo not a link, `DemoNav` suppressed.
4. CTA wording repeats at least three times per page.
5. Consent checkbox present and **unticked**.
6. Unknown slug returns a 404 page.
7. No horizontal scroll at 390px.
8. **Third-campaign acceptance test:** add `mr-sains-throwaway.ts` plus one registry line, confirm
   `/lp/mr-sains-throwaway` renders correctly with its own price, seats, FAQ count and level
   options, then delete it. No component was edited. The spec suite auto-covered it too, going from
   43 to 51 tests without a line being written.

## Out of scope

Tracking code. The Pixel and Conversions API work is a separate task with its own spec, and doing
it half-way is worse than not doing it. The quiz is separately quoted and comes much later.
