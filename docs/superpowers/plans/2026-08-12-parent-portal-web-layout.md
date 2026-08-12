# Parent Portal Web Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Widen the parent portal to an 880px frame on desktop with the demo cycle control as a sticky sidebar, and turn it into a floating pill + bottom sheet on mobile.

**Architecture:** The `parent` layout owns a responsive grid (`content | 260px demo panel`) at `lg+`. Three new components replace `ParentDemoStateBar`: a shared step list, a desktop sidebar card, and a mobile pill + sheet. A tiny composable decides demo-step navigation (suspended step navigates to the suspended page and back). The home page reflows into a 2-column grid at `lg` using `display: contents` wrappers so the mobile narrative order is preserved by flex `order`.

**Tech Stack:** Nuxt 4, Vue 3 `<script setup lang="ts">`, Tailwind v4 utility classes + inline style tokens (existing repo idiom), Vitest.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-12-parent-portal-web-layout-design.md`
- NEVER run `git commit` or `git push` — user's global rule requires explicit permission each time. Prepare changes only; the user commits or grants permission at the end.
- No backdrop-filter anywhere (it renders inert in this app). Scrims are plain rgba.
- Sentence case copy, no em dashes. Parent-facing copy in Malay; demo-control hint text stays English (walkthrough chrome).
- All data through composables; no data inlined in components.
- No changes to seed data, types, `/portal/parents`, or other portals.
- Follow the repo styling idiom: Tailwind utility classes for layout/breakpoints, inline `:style` for exact px values and theme tokens. A responsive value (e.g. max-width that changes at `lg`) must live in classes, not inline style, because inline style overrides classes.

---

### Task 1: Demo step navigation composable

**Files:**
- Create: `app/composables/useDemoStepSelect.ts`
- Test: `test/composables/demoStepSelect.spec.ts`

**Interfaces:**
- Consumes: `usePortalDemo()` from `~/composables/usePortalDemo` (existing; `demo.set(key)` mutates cycle state), `useRoute`/`useRouter` from `vue-router`.
- Produces: `demoStepTarget(step: CycleState, currentPath: string): string | null` (pure decision function) and `useDemoStepSelect(): (step: CycleState) => void` (sets state, then navigates if a target is returned). Task 2 calls `useDemoStepSelect()`.

- [ ] **Step 1: Write the failing test**

```ts
// test/composables/demoStepSelect.spec.ts
import { describe, it, expect } from 'vitest'
import { demoStepTarget } from '~/composables/useDemoStepSelect'

const HOME = '/portal/parent'
const SUSPENDED = '/portal/parent/suspended'

describe('demoStepTarget', () => {
  it('navigates to the suspended screen when the suspended step is picked', () => {
    expect(demoStepTarget('suspended', HOME)).toBe(SUSPENDED)
  })

  it('stays put when suspended is picked on the suspended screen', () => {
    expect(demoStepTarget('suspended', SUSPENDED)).toBeNull()
  })

  it('returns home when a non-suspended step is picked on the suspended screen', () => {
    expect(demoStepTarget('paid', SUSPENDED)).toBe(HOME)
    expect(demoStepTarget('due', SUSPENDED)).toBe(HOME)
    expect(demoStepTarget('grace', SUSPENDED)).toBe(HOME)
  })

  it('does not navigate for non-suspended steps on the home screen', () => {
    expect(demoStepTarget('paid', HOME)).toBeNull()
    expect(demoStepTarget('final', HOME)).toBeNull()
    expect(demoStepTarget('partial', HOME)).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/composables/demoStepSelect.spec.ts`
Expected: FAIL (cannot resolve `~/composables/useDemoStepSelect`)

- [ ] **Step 3: Write the implementation**

```ts
// app/composables/useDemoStepSelect.ts
import { useRoute, useRouter } from 'vue-router'
import { usePortalDemo, type CycleState } from '~/composables/usePortalDemo'

const HOME_PATH = '/portal/parent'
const SUSPENDED_PATH = '/portal/parent/suspended'

/**
 * Where picking a demo step should take the walkthrough, if anywhere.
 *
 * The suspended step opens the recovery screen; leaving the suspended state
 * from that screen returns home. Everything else stays where it is.
 */
export function demoStepTarget(step: CycleState, currentPath: string): string | null {
  if (step === 'suspended') return currentPath === SUSPENDED_PATH ? null : SUSPENDED_PATH
  return currentPath === SUSPENDED_PATH ? HOME_PATH : null
}

/** Demo-only: apply a cycle step and walk the demo to the matching screen. */
export function useDemoStepSelect() {
  const demo = usePortalDemo()
  const route = useRoute()
  const router = useRouter()
  return (step: CycleState) => {
    demo.set(step)
    const target = demoStepTarget(step, route.path)
    if (target) router.push(target)
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/composables/demoStepSelect.spec.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Run the full suite to confirm nothing broke**

Run: `npm run test`
Expected: PASS

---

### Task 2: Demo control components (step list, panel, sheet)

**Files:**
- Create: `app/components/parent/ParentDemoStepList.vue`
- Create: `app/components/parent/ParentDemoPanel.vue`
- Create: `app/components/parent/ParentDemoSheet.vue`

**Interfaces:**
- Consumes: `usePortalDemo()` (steps, cycle, stepFor), `useDemoStepSelect()` from Task 1. Components auto-import by path convention (`ParentDemoStepList` etc.).
- Produces: `<ParentDemoPanel />` (desktop sidebar card, self-hiding below `lg` is NOT built in — the layout places it inside a `hidden lg:block` column) and `<ParentDemoSheet />` (renders nothing at `lg+` via `lg:hidden` root). `ParentDemoStepList` emits `selected` after a step is picked (the sheet uses it to close).

No unit tests: the repo tests composables/utils/content only, not presentational components. Verified visually in Task 6.

- [ ] **Step 1: Create the shared step list**

```vue
<!-- app/components/parent/ParentDemoStepList.vue -->
<script setup lang="ts">
import { usePortalDemo } from '~/composables/usePortalDemo'
import { useDemoStepSelect } from '~/composables/useDemoStepSelect'
import type { CycleState } from '~/composables/usePortalDemo'

// Demo control, not part of the product. The one list of cycle steps,
// rendered by the desktop panel and the mobile sheet.
const demo = usePortalDemo()
const select = useDemoStepSelect()
const emit = defineEmits<{ selected: [] }>()

function pick(key: CycleState) {
  select(key)
  emit('selected')
}
</script>

<template>
  <div>
    <div class="flex flex-col" :style="{ gap: '6px' }">
      <button
        v-for="s in demo.steps"
        :key="s.key"
        type="button"
        class="flex items-center justify-between gap-2 font-semibold text-left transition-colors"
        :style="{
          padding: '9px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          border: '1px solid transparent',
          background: demo.cycle.value === s.key ? 'var(--color-ink)' : 'var(--color-tile-inactive)',
          color: demo.cycle.value === s.key ? '#fff' : 'var(--color-ink-soft)',
        }"
        @click="pick(s.key)"
      >
        <span>{{ s.label }}</span>
        <span :style="{ fontSize: '10.5px', opacity: 0.75 }">{{ s.day }}</span>
      </button>
    </div>

    <div class="text-faint" :style="{ fontSize: '11px', marginTop: '8px', lineHeight: '1.45' }">
      {{ demo.stepFor(demo.cycle.value).hint }}
    </div>
  </div>
</template>
```

- [ ] **Step 2: Create the desktop panel**

```vue
<!-- app/components/parent/ParentDemoPanel.vue -->
<script setup lang="ts">
// Demo control, not part of the product. Desktop sidebar variant; the layout
// shows it only at lg+ and gives it the 260px column.
</script>

<template>
  <div class="sticky" :style="{ top: '76px' }">
    <div
      class="bg-surface"
      :style="{
        border: '1px solid var(--color-border-marketing)',
        borderRadius: '20px',
        padding: '16px',
        boxShadow: '0 10px 28px rgba(30,35,72,.06)',
      }"
    >
      <div
        class="font-bold uppercase text-faint"
        :style="{ fontSize: '9.5px', letterSpacing: '0.07em', marginBottom: '10px' }"
      >
        Demo · kitaran bulanan
      </div>
      <ParentDemoStepList />
    </div>
  </div>
</template>
```

- [ ] **Step 3: Create the mobile pill + bottom sheet**

The pill sits bottom-left because `DemoWatermark` already owns the bottom-right corner. Scrim is plain rgba, no backdrop-filter.

```vue
<!-- app/components/parent/ParentDemoSheet.vue -->
<script setup lang="ts">
import { ref } from 'vue'

// Demo control, not part of the product. Mobile variant: a floating pill that
// opens a bottom sheet with the cycle steps.
const open = ref(false)
</script>

<template>
  <div class="lg:hidden">
    <button
      type="button"
      class="fixed font-semibold"
      :style="{
        left: '16px',
        bottom: '16px',
        zIndex: 60,
        background: 'var(--color-ink)',
        color: '#fff',
        borderRadius: '999px',
        padding: '10px 16px',
        fontSize: '12.5px',
        boxShadow: '0 10px 24px rgba(30,35,72,.28)',
      }"
      @click="open = true"
    >
      🎬 Demo
    </button>

    <div v-if="open" class="fixed inset-0" :style="{ zIndex: 70 }">
      <div
        class="absolute inset-0"
        :style="{ background: 'rgba(30,35,72,.45)' }"
        @click="open = false"
      />
      <div
        class="absolute bg-surface"
        :style="{
          left: 0,
          right: 0,
          bottom: 0,
          margin: '0 auto',
          maxWidth: '560px',
          borderRadius: '22px 22px 0 0',
          padding: '18px 18px 26px',
          boxShadow: '0 -12px 32px rgba(30,35,72,.18)',
        }"
      >
        <div class="flex items-center justify-between" :style="{ marginBottom: '12px' }">
          <div
            class="font-bold uppercase text-faint"
            :style="{ fontSize: '9.5px', letterSpacing: '0.07em' }"
          >
            Demo · kitaran bulanan
          </div>
          <button
            type="button"
            class="font-semibold text-muted"
            :style="{ fontSize: '12px', padding: '4px 8px' }"
            @click="open = false"
          >
            ✕
          </button>
        </div>
        <ParentDemoStepList @selected="open = false" />
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 4: Confirm the build still compiles**

Run: `npm run build`
Expected: build succeeds (components are created but not yet mounted anywhere)

---

### Task 3: Layout shell rework

**Files:**
- Modify: `app/layouts/parent.vue`
- Delete: `app/components/parent/ParentDemoStateBar.vue`

**Interfaces:**
- Consumes: `<ParentDemoPanel />`, `<ParentDemoSheet />` from Task 2.
- Produces: the grid shell every parent page renders into. Content column is `minmax(0, 880px)`; pages (Tasks 4-5) may assume up to 880px at `lg+` and the current 560px frame below.

- [ ] **Step 1: Rewrite the layout**

Replace the full template of `app/layouts/parent.vue` (script block unchanged):

```vue
<template>
  <div :style="{ background: 'var(--color-bg-app)', minHeight: '100vh' }">
    <header
      class="sticky top-0 z-50 bg-surface"
      :style="{ borderBottom: '1px solid var(--color-border-marketing)' }"
    >
      <div
        class="mx-auto flex items-center justify-between gap-3 max-w-[560px] lg:max-w-[1164px]"
        :style="{ padding: '11px 18px' }"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <LogoMark :size="34" />
          <div class="min-w-0">
            <div
              class="font-display font-bold text-ink truncate"
              :style="{ fontSize: '14.5px', lineHeight: '1.15' }"
            >
              {{ academy.name }}
            </div>
            <div class="font-bold uppercase text-faint" :style="{ fontSize: '9.5px', letterSpacing: '0.06em' }">
              Portal ibu bapa
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <IconTile :icon="parent.child.first.charAt(0)" tone="pink" :size="32" :radius="999" />
          <NuxtLink
            to="/demo"
            class="font-semibold text-muted hover:text-ink transition-colors"
            :style="{ fontSize: '12px' }"
          >
            Keluar
          </NuxtLink>
        </div>
      </div>
    </header>

    <main :style="{ background: 'linear-gradient(180deg, #FBF8FF, #FFFFFF 320px)' }">
      <div
        class="mx-auto max-w-[560px] lg:max-w-[1164px] lg:grid lg:grid-cols-[minmax(0,880px)_260px] lg:gap-6 lg:items-start"
        :style="{ padding: '18px 18px 64px' }"
      >
        <div>
          <slot />
        </div>
        <div class="hidden lg:block">
          <ParentDemoPanel />
        </div>
      </div>
    </main>

    <ParentDemoSheet />
    <DemoWatermark />
  </div>
</template>
```

Notes for the implementer:
- The old `<ParentDemoStateBar />` line between the header and `<main>` is gone.
- `maxWidth` moved from inline style to classes on both containers (inline style would override the `lg:` class).
- The slot is wrapped in a plain `<div>` so it forms the grid's first column.

- [ ] **Step 2: Delete the old strip**

Run: `rm app/components/parent/ParentDemoStateBar.vue`
Then: `grep -rn "ParentDemoStateBar" app/` — expected: no matches.

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: build succeeds.

---

### Task 4: Home page grid reflow

**Files:**
- Modify: `app/pages/portal/parent/index.vue`

**Interfaces:**
- Consumes: the layout grid from Task 3 (content column up to 880px at `lg+`).
- Produces: nothing consumed by later tasks.

**Mechanism:** the root container is `flex flex-col` on mobile and a `1.5fr/1fr` grid at `lg`. Two wrapper divs are `contents` on mobile (children participate directly in the root flex, so `order-*` controls the narrative) and become flex columns at `lg`. The same `order` value works in both contexts: the payment card is `order-1` when unpaid (top of page on mobile, top of the right column on desktop) and `order-6` when paid (drops below everything in both).

- [ ] **Step 1: Rewrite the template**

Replace the full template of `app/pages/portal/parent/index.vue`. The `<script setup>` block loses the `dots` unchanged but drops nothing else; only `moneyFirst` usage moves from `v-if` to class bindings:

```vue
<template>
  <div class="flex flex-col gap-4 lg:grid lg:grid-cols-[1.5fr_1fr] lg:gap-[18px] lg:items-start">
    <header class="order-none lg:col-span-2">
      <h1
        class="font-display font-bold text-ink"
        :style="{ fontSize: 'clamp(1.5rem, 5vw, 1.9rem)', lineHeight: '1.15', margin: '0 0 4px' }"
      >
        Salam, {{ p.guardianFirst.value }} 👋
      </h1>
      <p class="font-semibold text-muted" :style="{ fontSize: '13.5px', margin: 0 }">
        Ini yang berlaku dengan {{ p.child.first }} hari ini
      </p>
    </header>

    <!-- Left column at lg: today's classes, then the week. -->
    <div class="contents lg:flex lg:flex-col lg:gap-[18px]">
      <section
        class="order-2 bg-surface"
        :style="{
          border: '1px solid var(--color-border-marketing)',
          borderRadius: '24px',
          padding: '18px',
          boxShadow: '0 10px 28px rgba(30,35,72,.06)',
        }"
      >
        <div class="flex items-center justify-between gap-3" :style="{ marginBottom: '14px' }">
          <div class="font-display font-semibold text-ink" :style="{ fontSize: '16px' }">
            🎒 Kelas hari ini
          </div>
          <span class="font-semibold text-faint" :style="{ fontSize: '12px' }">{{ p.todayLabel }}</span>
        </div>

        <div v-if="p.todayRows.value.length" class="flex flex-col" :style="{ gap: '10px' }">
          <ParentClassRow
            v-for="row in p.todayRows.value"
            :key="row.cls.id"
            :row="row"
            show-join
          />
        </div>

        <p v-else class="text-muted" :style="{ fontSize: '13px', margin: 0 }">
          Tiada kelas hari ini. Kelas seterusnya hari Isnin.
        </p>
      </section>

      <section
        class="order-5 bg-surface"
        :style="{
          border: '1px solid var(--color-border-marketing)',
          borderRadius: '24px',
          padding: '18px',
          boxShadow: '0 10px 28px rgba(30,35,72,.06)',
        }"
      >
        <div class="font-display font-semibold text-ink" :style="{ fontSize: '16px', marginBottom: '12px' }">
          📅 Jadual minggu ini
        </div>
        <div class="flex flex-col" :style="{ gap: '12px' }">
          <ParentClassRow v-for="row in p.rows.value" :key="row.cls.id" :row="row" />
        </div>
      </section>
    </div>

    <!-- Right column at lg: payment, attendance, package. -->
    <div class="contents lg:flex lg:flex-col lg:gap-[18px]">
      <ParentPaymentCard
        :class="moneyFirst ? 'order-1' : 'order-6'"
        :cycle="p.cycle.value"
        :period="p.period"
        :due-label="p.dueLabel"
        :paid-on="p.paidLabel"
        :total="p.invoiceTotal.value"
        :outstanding="p.outstanding.value"
        :days-left="p.daysLeft.value"
      />

      <section
        class="order-3 bg-surface"
        :style="{
          border: '1px solid var(--color-border-marketing)',
          borderRadius: '24px',
          padding: '18px',
          boxShadow: '0 10px 28px rgba(30,35,72,.06)',
        }"
      >
        <div class="flex items-center justify-between gap-3" :style="{ marginBottom: '12px' }">
          <div class="font-display font-semibold text-ink" :style="{ fontSize: '16px' }">
            ✅ Kehadiran
          </div>
          <span class="font-semibold text-ink-soft" :style="{ fontSize: '13px' }">
            Hadir {{ p.attendance.value.attended }} daripada {{ p.attendance.value.total }} kelas
          </span>
        </div>
        <div class="flex items-center" :style="{ gap: '6px' }">
          <span
            v-for="(hadir, i) in dots"
            :key="i"
            :style="{
              width: '100%',
              height: '9px',
              borderRadius: '999px',
              background: hadir ? 'var(--color-fg-green)' : 'var(--color-tile-inactive)',
            }"
          />
        </div>
        <p class="text-muted" :style="{ fontSize: '12.5px', margin: '11px 0 0' }">
          {{ p.attendance.value.note }}
        </p>
      </section>

      <ParentPackageCard
        class="order-4"
        :lines="p.lines.value"
        :available="p.available.value"
        :total="p.invoiceTotal.value"
        :child-first="p.child.first"
      />
    </div>

    <p class="order-7 lg:col-span-2 text-center text-faint" :style="{ fontSize: '12px', margin: '4px 0 0' }">
      Ada soalan? <span class="font-semibold" :style="{ color: 'var(--color-whatsapp-deep)' }">Hubungi kami di WhatsApp</span>
    </p>
  </div>
</template>
```

Script change: the `moneyFirst` computed stays; the second `<ParentPaymentCard v-if="!moneyFirst">` instance is gone (single instance, order class flips instead). The root's old `:style="{ gap: '16px' }"` became `gap-4`.

Caveat for the implementer: `ParentPaymentCard` and `ParentPackageCard` must accept a `class` attribute on their root element (Vue forwards attrs to a single root automatically; verify each has a single root node — both do).

- [ ] **Step 2: Verify mobile order is unchanged**

Read the rendered order by `order` value for both cycle states and compare with the old template:
- Unpaid: header(0), payment(1), today(2), attendance(3), package(4), week(5), footer(7)
- Paid: header(0), today(2), attendance(3), package(4), week(5), payment(6), footer(7)

Expected: matches the pre-change narrative exactly.

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: build succeeds.

---

### Task 5: Suspended page centered column

**Files:**
- Modify: `app/pages/portal/parent/suspended.vue`

**Interfaces:**
- Consumes: the layout grid from Task 3.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Constrain the recovery column**

In `app/pages/portal/parent/suspended.vue`, change only the root element of the template from:

```vue
<div class="flex flex-col" :style="{ gap: '16px' }">
```

to:

```vue
<div class="mx-auto w-full flex flex-col" :style="{ gap: '16px', maxWidth: '540px' }">
```

Everything inside stays byte-identical. On mobile the content column is already ~524px wide so nothing visibly changes; at `lg` the card centers in the 880px column instead of stretching. (`maxWidth` can stay inline here because it does not vary by breakpoint.)

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: build succeeds.

---

### Task 6: Full verification and handoff

**Files:** none (verification only)

- [ ] **Step 1: Run the whole test suite**

Run: `npm run test`
Expected: PASS, including the Task 1 spec.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Visual check (dev server + browser)**

Run `npm run dev`, then check with the webapp-testing skill (or manually):
1. Desktop ≥1280px, `/portal/parent`: sidebar visible at right with 6 vertical steps + hint, sticky on scroll; content in 2 columns (classes left; payment/attendance/package right); no floating pill.
2. Click "Akses dijeda" in the sidebar → navigates to `/portal/parent/suspended`; recovery card centered narrow in the wide frame; sidebar still visible; click "Sudah bayar" → navigates back home, payment card shows paid state at the bottom of the right column.
3. Narrow window <1024px: no sidebar; floating "🎬 Demo" pill bottom-left; watermark bottom-right untouched; tap pill → opaque bottom sheet slides region with steps; picking a step applies it and closes the sheet; scrim tap and ✕ close it.
4. Mobile card order matches the pre-change narrative in both paid and unpaid states.

- [ ] **Step 4: Prepare the change for the user**

Run `git status` and `git diff --stat`, summarize the change, and ASK the user for permission to commit. Do not commit or push without it.
