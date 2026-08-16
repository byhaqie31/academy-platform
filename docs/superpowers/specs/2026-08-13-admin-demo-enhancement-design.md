# Admin portal demo enhancement

Date: 2026-08-13
Status: approved design, pending implementation plan

## Why

Two things happen in the same pass.

Hz Academy now runs fully online, so the four physical branches are no longer
part of the story the admin portal tells. A buyer clicking through the demo
currently sees "Kota Warisan" and "Taman Ixora" chips on almost every table,
which contradicts the pitch.

Separately, the admin portal is the meeting-winner and it has soft spots: a
payroll screen that is still a stub, buttons that do nothing, and a dashboard
that is thin for the first screen anyone sees.

## Scope

Originally the admin portal only. The owner then extended it to the tutor
portal and the public marketing site, so branches are now gone from every live
surface. See "Second pass" at the end.

Still out of scope, deliberately:

- The `Branch` type, `config/academy.ts` branches, and every seeded `branchId`
  all stay. The frozen `/v1` archive renders them, and keeping them means a
  future multi-branch centre is a display change rather than a migration.
- The seed is not reshaped into online cohorts. That larger reshape stays
  pending. One narrow exception is listed under "Online centre story".

## Governing constraints

From CLAUDE.md, and confirmed with the owner before this design was written:

- **The data seam holds.** Screens read through composables. No component gains
  inline data, and no screen touches the Pinia store directly.
- **Money stays pre-computed.** Flipping an invoice to paid and re-summing
  amounts the system already knew is allowed. Deriving fees or pay from rules
  wired to inputs is not. Payroll remains derived output, never hand-entered.
- **Hz stays configured-instance-one.** Nothing here hardcodes the centre.

## 1. Branch strip-out

### Removals

- `adminNav` loses the `/admin/branches` entry in `app/composables/usePortalNav.ts`.
- `app/pages/admin/branches.vue` is deleted.
- `demoNotes['/admin/branches']` is removed from `app/stores/demoIndex.ts`.
  The `/demo` directory derives its admin entries from `adminNav`, so the
  listing corrects itself once the nav entry is gone.

### Surfaces that lose a branch column, filter, or label

A branch column is replaced where the table would otherwise read as sparse, and
dropped outright where the remaining columns already carry the row. No surface
is left with a visible gap. Per surface:

| Surface | Branch reference today | Becomes |
| --- | --- | --- |
| Students index | `branch` column | `attendance` column, from `Student.attendancePct` |
| Students index filter | branch select in `StudentFilters` | dropped, four filters remain |
| Students detail | `level · branchShort` header line | `level` alone |
| Educators index | `branches` column | `classes` count, derived from `store.classes` by educator |
| Educators detail | `Educator · {{ e.branches }}` | `Educator · ` subject list |
| Collection | `branch` column | dropped, five columns remain |
| Billing | branch sub-label under the student name | the student's level |
| Timetable | Branches stat tile | hours scheduled this week |
| Timetable, `ScheduleGrid` | `tutor · branch` in a cell | `tutor · host` |
| Tonight | `tutor · branch · host` | `tutor · host` |
| `ScheduleToday` | `tutor · branchName` | `tutor · host` |
| `RevenueHero` | "across N branches" | "across N classes" |
| `OutstandingList` | "Overdue since 15 June · branchShort" | the date alone |
| `AssignClassModal` | Branch filter | dropped |
| `layouts/admin.vue` | "Kota Warisan" under the admin's name | "Centre admin" |
| Enquiry seed | "Adam · Matematik · Kota Warisan" | the student's level |

Timetable keeps its existing "Licences needed" tile, so the Branches tile is
not replaced with a second licence figure.

The last two rows were found by driving the built portal in a browser rather
than by reading the diff. The admin layout's profile chip renders on every
admin screen, so it was the most visible branch reference of all and appeared
on none of the pages being edited.

`ScheduleCell.branch` becoming `host` is a shared type, so
`components/tutor/TutorScheduleGrid.vue` shows the host too. That is one line in
a portal otherwise out of scope, and it is a consequence of the seam rather
than a widening of it.

### What stays

`useAcademy()` keeps `branches`, `branchById` and `branchShort`, because the
marketing surfaces still use them. Every seeded `branchId` stays on its record.
Nothing underneath is deleted, so nothing breaks, and restoring branch views for
a future multi-branch centre is a display change rather than a data migration.

## 2. Payroll screen

`app/pages/admin/payroll.vue` moves from a stub to Billing-level fidelity.

`usePayroll()` already exposes everything required, so this screen is a view
over an existing seam and introduces no calculation logic:

- `runFor(educatorId, period)` gives hours, rate and amount.
- `weeklyBreakdown(educatorId)` gives hours per week in `weekStarts` order.
- `byClass(educatorId)` gives hours and RM per class.

Shape:

- The three existing stat cards stay: payroll total, active tutors, hours logged.
- A table with one row per educator: name, subjects, hours, rate, derived amount.
- Each row expands to the four-week breakdown and the per-class breakdown.
- "Download payslip" raises a toast. It does not produce a file.

### The reconciliation guarantee

A tutor's pay on the admin payroll screen must equal what that tutor sees on
`/tutor/earnings`, because both derive from the same sessions. This is the
single most load-bearing consistency claim in the product and it gets a test.

## 3. Clickable actions

### State

A `demo` slice is added to `app/stores/academy.ts` alongside the existing
`attendance` map, which already establishes the pattern for non-persistent demo
mutation:

- `paidInvoiceIds`
- `chasedGuardianIds`
- `registeredStudents`

Store actions: `recordPayment`, `chase`, `registerStudent`, `resetDemo`.

Nothing in the slice survives a page refresh, and nothing mutates the seed
arrays.

### The seam

A new `useDemoActions()` composable is the only thing screens call. Screens
never reach into the store. When a backend lands, this composable's internals
change and its callers do not.

### Reactivity, the largest piece of work

Two composables currently snapshot their values at setup time and would never
re-render when demo state changes:

- `useCollection()` builds `rows` as a plain array, copying `status: inv.status`
  by value.
- `useAdminMetrics()` returns plain scalars.

Both must return `computed` values instead. Blast radius: Collection, the
dashboard, Timetable, `RevenueHero` and `OutstandingList`.

`useStudents()` and `useBilling()` already return the live store arrays and
need no change.

### Metric deltas

Headline metrics are centre-wide constants on purpose, since the real centre is
larger than the inspectable seed slice. A recorded payment therefore applies a
delta to the constant rather than recomputing from the seed. `outstanding` and
`outstandingCount` become computed as the seeded constant minus the demo
payments recorded so far, which keeps the fiction intact while letting the tile
move.

### The action set

1. **Billing.** Record payment on a pending or overdue row. Status flips to
   Paid, proof appears, toast confirms. The dashboard outstanding tile drops.
2. **Collection.** Row selection, then "Chase selected", which already exists as
   a dead button. Marks last chased as today and confirms how many families were
   reminded on WhatsApp.
3. **Tonight.** The existing per-row action becomes a nudge, and attendance
   marking uses the existing `setAttendance` action.
4. **Dashboard.** "+ Register new student" opens a small modal. On submit the
   student joins the list and the active students tile increments.
5. **Reset.** A reset control returns the demo to seeded state so a second
   walkthrough starts clean.

Feedback uses `useToast()` from @nuxt/ui v4, which is installed and currently
unused.

## 4. Dashboard

Two blocks are added above the existing content:

- **Collection cycle card.** Days remaining to the 7th, collected against
  outstanding, and projected suspensions on the 8th. This is the strongest
  commercial argument in the product, and because metrics become computed it
  visibly reacts when a payment is recorded on Billing. Links to
  `/admin/collection`.
- **Tonight strip.** Next evening slot, classes running, students expected
  against joined, and the alert count. Links to `/admin/tonight`.

`RevenueHero`, `ScheduleToday`, `EnquiryList` and `OutstandingList` all stay.

## 5. Online centre story

Copy and framing changes so the portal reads as fully online:

- `RevenueHero` says "across N classes" rather than "across N branches".
- Schedule and Tonight cards read `tutor · host` rather than `tutor · branch`.
  `TonightRow` already carries `host`.
- `demoNotes['/admin']` is refreshed and the branches note is removed.

One narrow seed touch, the only one in this spec: the dashboard `agenda` rows
are seeded at 3:00, 4:30 and 5:00 PM. Afternoon classes contradict a
two evening slot online centre, and the dashboard shows these rows directly, so
the five agenda times move to evening. This changes times on five curated rows.
It is not the larger cohort reshape, which stays pending.

Collection already reads correctly for an online centre, since access pausing on
the 8th is not a physical idea.

## Testing

Vitest is configured, with existing specs under `test/composables`,
`test/store`, `test/utils`, `test/content` and `test/icons`. New coverage:

- Recording a payment reduces outstanding, and `resetDemo` restores the seeded
  figure.
- Chasing marks the selected guardians and leaves the rest untouched.
- Collection rows reflect an invoice whose status changed, which is the
  regression the computed rewrite exists to prevent.
- Admin payroll for a given educator equals that educator's tutor earnings.
- No admin route renders a branch label, guarding the strip-out.

## Known inconsistency this surfaced

Building the payroll screen exposed a contradiction that already existed in the
seed. Derived payroll for the six educators on file is RM7,828, while the
centre-wide `payrollTotal` and `cost` constants are RM41,400, which the revenue
hero uses to compute margin. The two cannot both be right: RM41,400 across the
seeded 170 hours implies about RM243 an hour.

Nothing here hides it. Payroll shows the derived figure, because the screen's
whole claim is that pay is derived, and its tile is labelled as the educators on
file, the same way `useCollection` labels its scaled figures. Rebasing the
centre-wide money constants would also move revenue and margin, which is an
owner decision rather than a demo polish one.

## Second pass: tutor, parent and marketing

The owner extended the removal beyond admin. Branches are now absent from every
live surface, verified by loading all 31 pages in a browser.

**Tutor portal.** The branch legend on `/tutor/schedule` is gone. Class cards,
today's classes and the class detail header show the Zoom host instead, matching
what admin now shows. Hours-by-class shows the class alone. The profile chip
reads "Matematik" rather than "Matematik · 2 branches", and the class-reminder
notification no longer names a branch.

**Parent portal.** `ParentClassRow.branch` was computed on every row and never
rendered, so it is gone. `classFor()` also loses its branch fallback, leaving
roster, then level, then whatever exists.

**Marketing.** The homepage already had no branch section. Two remnants did
survive:

- `components/marketing/BranchGrid.vue` was an orphan, imported by nothing.
  Deleted. The frozen `/v1` keeps its own `V1BranchGrid`.
- `Stepper.vue` still carried six labels including "Branch", while the wizard
  is five steps. It sliced the first five, so the public registration form
  labelled step 3 "Branch" when that step is "Pilih subjek", and never showed
  the final "Hantar" label at all. Removing "Branch" realigns all five.

While correcting that array, its labels were also translated to Malay. CLAUDE.md
requires Malay on `/register`, and the surrounding page is already Malay
("Langkah 1 daripada 5"), so English labels were a live rule violation on the
line being edited.

## Known coherence gap after this work

Admin's dashboard agenda now runs at 7:30 and 9:00 in the evening, but the
seeded `classes` still teach at 3:00, 4:30 and 5:00 in the afternoon, and the
tutor portal reads its times from those classes. A viewer moving from the admin
dashboard to the tutor dashboard sees evening in one and afternoon in the other.

Before this work both said afternoon, which was coherent but wrong for an online
centre. Closing the gap properly means moving every class to the two evening
slots, which collapses the timetable grid and changes peak concurrency, and
therefore the licence counts the timetable sells. That is the cohort reshape,
which remains an owner decision.

## Risks

- The computed rewrite of `useCollection` and `useAdminMetrics` touches five
  consuming surfaces. Handled first, and separately from the feature work, so a
  reactivity regression is not tangled with new screens.
- Stripping branch columns can leave visually unbalanced tables. The replacement
  rule exists to prevent this, and each table is reviewed rendered rather than
  in the diff.
