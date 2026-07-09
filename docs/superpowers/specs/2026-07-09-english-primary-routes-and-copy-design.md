# English-primary routes and copy

Date: 2026-07-09
Status: approved, ready for implementation plan

## Goal

Make English the primary language of the Academy Platform mockup: English URL paths, English UI
copy, no Malay sub-labels. This is groundwork for a later pivot from "Hz Academy, a tuition centre"
to a generic SaaS product sold to tuition centres.

CLAUDE.md already states the convention "English label with a smaller Malay sub-label." The codebase
applies it unevenly, and in places inverts it. This change resolves the inconsistency by going
English-only, and updates CLAUDE.md to match.

## Non-goals

Deferred to their own specs. Do not start them here.

- The Hz Academy to SaaS rebrand. `config/academy.ts` still reads `name: 'Hz Academy'` when this
  change is done.
- The marketing page's audience shift from parents to centre owners.
- A real i18n layer (`@nuxtjs/i18n`, locale files, `useT()`). Rejected as abstraction ahead of need;
  see "Approach" below.

## Approach

Replace Malay strings in place. No locale layer, no retained `ms` fields.

The alternative considered was keeping `NavItem.ms` populated but unrendered, as a seed for future
i18n. Rejected: `ms` exists on exactly one type and covers 14 of several hundred Malay strings. The
remainder are inline in 44 `.vue` templates with nowhere to be kept. Retaining `ms` would preserve
~5% of the translations while leaving a field on the type that no code reads and that implies an
i18n capability the app does not have.

The Malay strings are not lost. Git history preserves all of them, and the commit immediately
before this change *is* the Malay version. `git show <sha>:app/pages/portal/ibubapa.vue` recovers
any string. Making the removal one clean, reviewable commit is what keeps it cheap to reintroduce.

## Design

### 1. Narrow `Day` to a union (do this first)

`app/types/index.ts:75` declares `day: string`. Day values are compared against Malay literals in
four places:

| Location | Code | Silent failure if missed |
|---|---|---|
| `app/pages/tutor/index.vue:21` | `c.day === 'Isnin'` | "Classes today" renders 0 |
| `app/components/tutor/TodayClasses.vue:17` | `c.day === 'Isnin'` | Today's class list renders empty |
| `app/composables/useSchedule.ts:4` | `DAYS = ['Isnin', ...]` | Schedule grid renders blank columns |
| `app/composables/useGreeting.ts:4` | `DAYS = ['Ahad', 'Isnin', ...]` | Greeting names the wrong day |

Because `day` is `string`, renaming the 21 day values in `app/stores/academy.ts` leaves every one of
these comparisons valid TypeScript. They compile, match nothing, and break the demo silently. This
is the primary risk in the change.

Introduce in `app/types/index.ts`:

```ts
export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
```

`'Sun'` is required by `useGreeting`, which must cover all seven weekdays, even though no class is
scheduled on a Sunday.

Apply it to `Class.day` and to both `DAYS` arrays. Every stale comparison then becomes a compile
error, and `npm run typecheck` enumerates the work rather than grep.

**The two `DAYS` arrays are not interchangeable.** They look alike and mean different things:

- `useSchedule.ts` — six entries, Monday first, no Sunday. Defines schedule grid **column order**.
- `useGreeting.ts` — seven entries, **Sunday first**, because it is indexed by `Date.getDay()`.

A single find-and-replace across both produces an off-by-one greeting. Change them separately.

### 2. Route renames

Admin routes are already English and are untouched. Use `git mv` so history follows the files.

| Old | New |
|---|---|
| `/portal/ibubapa` | `/portal/parents` |
| `/daftar` | `/register` |
| `/tutor/jadual` | `/tutor/schedule` |
| `/tutor/kelas` | `/tutor/classes` |
| `/tutor/kelas/[id]` | `/tutor/classes/[id]` |
| `/tutor/rancangan` | `/tutor/lesson-plans` |
| `/tutor/pendapatan` | `/tutor/earnings` |

Route references are all static strings. There is no `navigateTo`, no `router.push`, and no route
name in `test/` or `nuxt.config.ts`. Eleven inbound links across eight components:

- `app/components/marketing/SiteFooter.vue` (`/portal/ibubapa`, `/daftar`)
- `app/components/marketing/LoginDropdown.vue` (`/portal/ibubapa`)
- `app/components/marketing/BranchGrid.vue` (`/daftar` x2)
- `app/components/marketing/SiteHeader.vue` (`/daftar`)
- `app/components/marketing/Hero.vue` (`/daftar`)
- `app/components/marketing/CtaBanner.vue` (`/daftar`)
- `app/components/tutor/TodayClasses.vue` (`/tutor/jadual`)
- `app/components/tutor/PlansThisWeek.vue` (`/tutor/rancangan`)
- `app/components/tutor/EarningsMini.vue` (`/tutor/pendapatan`)
- `app/pages/tutor/index.vue` (`/tutor/pendapatan`)
- `app/pages/tutor/kelas/[id].vue` (`/tutor/kelas` x2)
- `app/composables/usePortalNav.ts` (four `to:` values)

Plus one string concatenation a path-literal regex will not catch:

`app/components/tutor/TutorScheduleGrid.vue:52` — `:to="'/tutor/kelas/' + cell.classId"`

**No redirects.** `public/_redirects` is a catch-all SPA fallback (`/* /index.html 200`), so old
paths render the app shell then 404 client-side. Acceptable: the mockup is unshipped and has no
external inbound links. Add per-route redirects only if a stale link has been shared.

### 3. Translation policy

The dividing line is **product language versus domain fact**, not component versus store. Some chrome
is stored as data, and some data is a proper noun. Judge each string by what it *is*, not where it
lives.

Translate:

- UI chrome, headings, buttons, labels, empty states
- Navigation labels
- Notification copy (`app/composables/useNotifications.ts`)
- `academy.tagline` — "Dipercayai sejak 2014" to "Trusted since 2014"
- `academy.branches[].hours` — "Isnin–Sabtu · 3PM–9PM" to "Mon to Sat · 3PM–9PM"
- Day names, per section 1
- **Month names** in `useGreeting.ts` — `Januari`, `Februari`, `Mac`, `Mei`, `Jun`, `Julai`,
  `Ogos`, `Oktober`, `Disember` to `January` … `December`
- **Greeting strings** in `useGreeting.ts` — `Selamat pagi` / `Selamat petang` / `Selamat malam` to
  `Good morning` / `Good afternoon` / `Good evening`, preserving the existing hour boundaries
  (05:00–11:59, 12:00–18:59, 19:00–04:59)
- **`Class.ampm`** — store values `'PETANG'` and `'MALAM'` become `'AFTERNOON'` and `'EVENING'`.
  These sit in the store but are rendered raw as uppercase labels by
  `app/components/admin/ScheduleToday.vue:30` and `app/components/tutor/TodayClasses.vue:42`. They
  are chrome, despite living in seed data. Applies to `AgendaRow.ampm` too.

Leave untouched:

- **Subject names.** `Matematik`, `Sains`, `Sejarah`, `Bahasa Melayu`, `Bahasa Inggeris`,
  `Geografi`, `Pendidikan Islam`. These are KPM curriculum proper nouns. An English-speaking centre
  owner in Malaysia still teaches "Bahasa Melayu." Translating them makes the seed data wrong.
- **School levels.** `Tahun 1`–`Tahun 6`, `Tingkatan 1`–`Tingkatan 5`. KPM curriculum terms. Do not
  render these as "Year 4" or "Form 3", however tempting.
- **Class names.** `Tahun 4 Bestari`, `Tingkatan 3 Cerdik`, `SPM Intensif`. Authentic Malaysian
  class naming; part of what makes the demo credible.
- Person names, including honorifics (`Puan Aisyah`, `Encik`, `Cik`, `Tuan`)
- Branch names (`Kota Warisan, Sepang`, `Taman Sutera, Kajang`)
- IC numbers, RM amounts, school names

`test/utils/validation.spec.ts:25` asserts on `'Matematik'`. Under this policy it stays passing and
unedited. If that test needs changing, the boundary has been drawn wrong.

On `hours`: CLAUDE.md says "No em dashes. Use commas, periods, or 'to' for ranges." That rule targets
em dashes as sentence punctuation. En-dashes as numeric range glyphs (`3PM–9PM`) are kept; day ranges
use "to".

### 4. `NavItem` drops `ms`

```ts
export interface NavItem {
  to: string
  icon: string
  label: string
}
```

`usePortalNav.ts:23-26` currently has `en` and `ms` **swapped** in `tutorNav`: `en: 'Jadual Saya',
ms: 'My schedule'`. Malay sits in the English field and English in the Malay field. Collapsing to a
single `label` resolves both errors at once. Update `adminNav` and `tutorNav`, and every component
rendering `item.en` or `item.ms`.

### 5. Documentation

- `CLAUDE.md` — remove "Bilingual where natural: English label with a smaller Malay sub-label" from
  copy conventions; it now contradicts the code. Note that subject names and seeded Malaysian data
  stay in Malay.
- `docs/superpowers/PROJECT-CONTEXT.md` — three `portal/ibubapa` references (lines 270, 288, 387).

Existing plan and spec files under `docs/superpowers/plans/` and `docs/superpowers/specs/` are
historical records of past work. Leave them.

## Verification

Evidence required before claiming completion:

1. `npm run typecheck` passes. This is the real gate; the `Day` union makes stale comparisons fail.
2. `npm test` passes, with `test/utils/validation.spec.ts` unmodified.
3. Drive the running app and confirm the two silent-failure surfaces:
   - `/tutor` shows a non-zero "Classes today".
   - `/tutor/schedule` renders populated day columns, Monday first.
   - The greeting names the correct weekday.
4. `/portal/parents`, `/register`, and every renamed tutor route load. No dead links from the
   marketing footer or login dropdown.
5. Both greps return nothing. Scope them to `app/` and `config/`; this spec and the historical plan
   docs legitimately contain the old names.

   Routes and nav:

   ```
   grep -rniE 'ibubapa|ibu bapa|daftar|jadual|kelas|pendapatan|rancangan' app/ config/
   ```

   Residual Malay chrome:

   ```
   grep -rnE 'Isnin|Selasa|Rabu|Khamis|Jumaat|Sabtu|Ahad|PETANG|MALAM|Selamat|Januari|Februari|Mac|Mei|Julai|Ogos|Oktober|Disember' app/ config/
   ```

   The second grep is case-sensitive on purpose. `Mac` and `Mei` are Malay months, but a
   case-insensitive match would also hit `mac`, and `Mei Yi` is a student name that must survive.
   Inspect any hit rather than deleting it blindly.

## Delivery

Work happens on `feat/english-primary-routes-and-copy`, then merges to `main` via PR.

The pre-pivot Hz Academy state is preserved as the annotated tag `hz-academy-malay-demo`
(`c54e44f`), not as a long-lived branch. A tag cannot accidentally receive commits, it self-documents
why that state matters, and it keeps one tree to maintain. `git checkout hz-academy-malay-demo`
restores the Malay-primary demo in full; `git show hz-academy-malay-demo:<path>` recovers any
individual Malay string.

`main` moves forward to the English-primary product. Push the tag with the PR.
