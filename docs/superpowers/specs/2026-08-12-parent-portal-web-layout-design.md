# Parent portal web layout and demo controls

Date: 2026-08-12
Status: approved

## Goal

The parent portal (`/portal/parent`, `/portal/parent/suspended`) is phone-first, but demos
happen on laptops. On desktop the portal widens to the 880px frame the old `/portal/parents`
teaser uses, and the demo cycle control moves out of the content flow: a sidebar on desktop,
a floating pill with a bottom sheet on mobile.

## Layout shell (`app/layouts/parent.vue`)

- At `lg+` the main area is a centered grid: `[minmax(0, 880px) content | 260px demo panel]`,
  ~24px gap (~1164px total). Below `lg`, the current single 560px column, unchanged.
- The sticky header's inner container widens to the same total width at `lg+` so the logo
  aligns with the content's left edge. Unchanged on mobile.
- `ParentDemoStateBar.vue` (the horizontal strip) is deleted, replaced by `ParentDemoPanel`
  (desktop) and `ParentDemoSheet` (mobile).
- Gradient background and `DemoWatermark` stay.

## Demo panel, desktop (`app/components/parent/ParentDemoPanel.vue`)

- A card in the sidebar column, `sticky` below the header so it stays visible on scroll.
- Content: "Demo · kitaran bulanan" eyebrow, the 6 cycle steps as a vertical list
  (day + label, active step ink-filled), active step's hint below the list.
- Same visual language as the old strip, stacked vertically. Hint text stays English
  (walkthrough chrome, not parent-facing product).
- Hidden below `lg`.

## Demo sheet, mobile (`app/components/parent/ParentDemoSheet.vue`)

- Below `lg` only: a floating "🎬 Demo" pill fixed bottom-right.
- Tap opens a bottom sheet: opaque white surface, rounded top corners, plain rgba scrim
  (no backdrop-filter, it is inert in this app), same step list + hint.
- Selecting a step applies it and closes the sheet. Tapping the scrim or a close
  affordance dismisses.

## Navigation behavior (shared)

- Selecting a step calls `demo.set()`, then:
  - `suspended` → `router.push('/portal/parent/suspended')`
  - any other step, while on the suspended route → back to `/portal/parent`
- Routing lives in a tiny shared composable (`useDemoStepSelect`) used by both components.
  `usePortalDemo` stays pure state.

## Home page reflow (`app/pages/portal/parent/index.vue`)

- Mobile: current narrative order untouched (payment first when unpaid, drops below the
  week schedule when paid).
- At `lg`, cards place into a `1.5fr / 1fr` grid:
  - Greeting: full width
  - Left column: 🎒 Kelas hari ini, then 📅 Jadual minggu ini
  - Right column: 💳 payment card (top when unpaid, bottom when paid), ✅ Kehadiran,
    📦 package card
  - WhatsApp footer line: full width
- The duplicate `<ParentPaymentCard v-if>` pair collapses into one instance whose grid
  placement and mobile order shift with `moneyFirst`.

## Suspended page (`app/pages/portal/parent/suspended.vue`)

- Inherits the wide shell from the layout, including the demo sidebar (that is how the
  recovery flow is demoed).
- The recovery card + WhatsApp link + receipt note stay a centered `max-width: 540px`
  column inside the wide frame. Card content unchanged.

## Addendum: demo chrome moves to an outer frame (approved 2026-08-12)

Supersedes the in-grid sidebar above. The demo control must read as scaffolding
around the product, never as part of it:

- Desktop: a dark ink rail fixed to the left viewport edge (240px, full
  height): demo badge, cycle steps (dark variant), hint, "← Keluar demo" at the
  bottom. The layout clears it with left padding at `lg+`.
- The product frame is clean: header and content center at 880px, no grid
  column, and the "Keluar" link leaves the portal header (the avatar stays).
- Mobile: floating pill + sheet as before, with "← Keluar demo" added to the
  sheet.

## Addendum: portal login with a 6-digit code (approved 2026-08-12)

`/portal/login` becomes a two-step fake OTP flow, replacing the dead-end
"Pautan dihantar" state:

- Step 1: phone input as today, copy shifts from magic link to a 6-digit
  WhatsApp code ("Hantar kod ke WhatsApp").
- Step 2: six digit boxes with auto-advance focus, backspace-to-previous and
  full-code paste. Shows the masked phone, "Hantar semula kod" (fake) and
  "Tukar nombor" (back to step 1).
- Any 6 digits verify. On the 6th digit, a brief "Mengesahkan..." beat, then
  navigate to `/portal/parent`.
- `maskMyPhone` joins `app/utils/validation.ts` with unit tests. No real auth,
  no session, per project rules.

## Out of scope

- No changes to composable data logic, seed data, types, or any other portal.
- No changes to `/portal/parents` (the superseded teaser).

## Verification

- `npm run build` passes.
- Visual: desktop shows sidebar + wide grid on both pages; mobile shows floating pill,
  bottom sheet works; suspended navigation round-trip works from the demo control.
