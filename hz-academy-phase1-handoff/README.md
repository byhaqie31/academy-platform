# Hz Academy · phase 1 handoff

Everything needed to build the phase 1 marketing surface into the `academy-platform` repo.
Prepared by Axel Nova Ventures, August 2026.

## Start here

**`BUILD-PROMPT.md`** — paste into Claude Code with the repo open. It is written against the actual
repo conventions: OKLCH tokens, the composable data seam, `config/academy.ts`, sentence case, Malay
primary. It includes a colour mapping table, a file plan, acceptance criteria and a "do not" list.

## What is in here

```
design/                      the approved design, open in a browser
  website.html               six pages, click the nav to switch between them
  lp-matematik-spm-ogos.html landing page, Menengah Atas audience
  lp-matematik-rendah-ogos.html   landing page, Sekolah Rendah audience
  src/*.template.html        the same files without embedded fonts, easier to read

content/                     two campaign data files, ready to drop into
  ma-matematik-ogos.ts       app/content/landings/ after the type exists
  rendah-matematik-ogos.ts

documents/                   client-facing, for the meeting
  Axel-Nova-Hz-Academy-Proposal-v2.pdf     19 pages, the full proposal
  Axel-Nova-Hz-Academy-Quotation.pdf       5 pages, three options, signature block
  Hz-Academy-Discovery-Questions.pdf       75 questions, 16 that block the quote

screenshots/                 rendered references, desktop and mobile
```

## The three design decisions worth not losing

1. **A landing page has no navigation.** The website has a menu, the campaign pages do not. A menu on
   a landing page typically costs 10 to 30 percent of conversions. The masthead is a logo, not a link.

2. **The portal login is not in the site header.** It lives at `/portal/masuk` with a quiet footer
   link. A visitor arriving from an ad should see a page selling classes, not a login form. This also
   keeps phase 1 completely static, with no auth anywhere in the build.

3. **The deliverable is the template, not the two pages.** A third campaign must be a new data file
   and nothing else. If it needs a component edit, the system is not finished. There is an acceptance
   test for exactly this.

## Placeholders to replace before this is shown as final

- Fees (RM 120, 150, 180) are illustrative, not confirmed by Hz
- Seat counts ("13 of 18 filled") are illustrative. Scarcity only works if it is true
- Tutor names, photos and testimonials are seeded demo data
- WhatsApp number comes from `config/academy.ts`, currently 60123456789
