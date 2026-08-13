# Fluent icons in the portals

Date: 2026-08-13
Status: approved

## Goal

Replace emoji "icons" in the admin, tutor, and parent portals (and the demo chrome) with
Fluent icons from Iconify, rendered through @nuxt/ui's built-in `UIcon`. Marketing surfaces
keep their emoji personality.

## Scope

**In scope:** admin portal, tutor portal, parent portal (`/portal/parent`), demo chrome
(`DemoNav`, `DemoWatermark`, `demoIndex` store), shared portal primitives (`PortalShell`,
`IconTile`, `NotificationDropdown`), portal-facing data (`usePortalNav.ts`,
`useNotifications.ts`, `utils/status.ts`, portal-read fields in stores).

**Out of scope:** `v1/` components, `landing/` components, `marketing/` components,
`siteContent.ts`, all marketing pages, and emojis inside sentence copy anywhere
(e.g. "Hello {academy} team 👋" stays).

## Icon style

Fluent regular (outline) everywhere, with the filled variant for the active nav item —
the native Fluent selected-state pattern. Icon names use the 24px grid for nav and tiles,
20px where the context is small (inline pills, dense rows); pick per site to match
current emoji sizing.

## Foundation

- Add `@iconify-json/fluent` as a devDependency. @nuxt/ui v4 bundles `@nuxt/icon`,
  which picks up locally installed Iconify JSON sets at build time — offline, no runtime
  API fetches, no extra config.
- Icons render as `<UIcon name="i-fluent-<name>-<size>-<variant>" />`.

## Design by area

### Nav (usePortalNav.ts, PortalShell.vue, parent portal nav)

Nav items store a **base name without variant suffix**: `icon: 'i-fluent-grid-24'`.
The shell renders `` `${item.icon}-${isActive ? 'filled' : 'regular'}` `` in a `UIcon`,
replacing the current emoji `<span>`. Every Fluent icon chosen for nav must exist in both
regular and filled variants at the chosen size (verify at pick time).

### IconTile.vue (shared primitive)

Keeps its API (`icon: string`). New behaviour: if `icon` starts with `i-`, render a
`<UIcon>` sized to ~55% of the tile; otherwise render the string as text (initials and
marketing emoji tiles keep working unchanged). Portal call sites pass Fluent names.

### Data-side swaps

- `useNotifications.ts`: each notification's `icon` emoji becomes a Fluent name.
- `utils/status.ts` `sourceIcon()`: returns Fluent names
  (Facebook `i-fluent-megaphone-20-regular`, TikTok `i-fluent-music-note-2-20-regular`,
  fallback `i-fluent-search-20-regular`).
- `demoIndex.ts`: `icon` fields become Fluent names; emojis inside copy strings stay.

### Shared subject data (stores/academy.ts)

Subjects feed both marketing (keeps emoji) and portals (wants Fluent). Each subject gains
a `fluentIcon` field alongside the existing emoji `icon`. Marketing keeps reading `icon`;
portal components read `fluentIcon`. One data source, no divergent copies. The `Subject`
type in `types/` gains the field.

### Hardcoded emojis in portal templates

~25 component/page files under `app/components/admin|tutor|parent/`, `app/components/ui/`,
`app/pages/admin|tutor/`, `app/pages/portal/parent/` have emojis directly in templates.
Each becomes an inline `<UIcon>` with a hand-picked Fluent equivalent, sized and coloured
to match its context. Judgment rule: an emoji that plays an icon role (bullet, tile, stat,
button glyph) is swapped; an emoji that reads as tone inside a sentence stays.

## Error handling

None beyond build-time: a mistyped icon name renders nothing and warns in dev console;
the visual pass catches these.

## Testing

- Existing vitest suite stays green.
- Visual pass with webapp-testing: each portal shell (admin, tutor, parent) plus one HERO
  screen per portal — check nav active/inactive variants, tiles, notifications dropdown,
  and that marketing pages still show emojis.
