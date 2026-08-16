<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppButton from '~/components/ui/AppButton.vue'
import { useDemoIndex } from '~/composables/useDemoIndex'
import { useDemoActions } from '~/composables/useDemoActions'
import { toneTile } from '~/utils/tone'
import type { DemoGroup } from '~/types'

// Floating screen switcher for the prototype walkthrough. It rides on top of
// whatever page you are on, so the client can jump between the website, the
// portals and the v1 archive without going back to /demo.
//
// Mounted once in app.vue rather than per layout, which is how it reaches the
// frozen /v1 archive without any file in app/components/v1 being edited.
const { groups } = useDemoIndex()
const route = useRoute()
const demo = useDemoActions()
const toast = useToast()

function resetDemo() {
  demo.reset()
  open.value = false
  toast.add({
    title: 'Demo data reset',
    description: 'Payments, reminders and new students are back to how they started.',
    icon: 'i-fluent-arrow-counterclockwise-24-regular',
  })
}

const open = ref(false)
watch(() => route.path, () => (open.value = false))

const tabEl = ref<HTMLButtonElement | null>(null)
const closeEl = ref<HTMLButtonElement | null>(null)

/**
 * Whether the switcher rides on the campaign landing pages too.
 *
 * `true` because this is a prototype walkthrough: being stranded on a landing
 * page with no way back is worse, for a client clicking around, than the rule
 * it bends.
 *
 * ⚠️ BEFORE ANY CAMPAIGN PAGE TAKES REAL AD TRAFFIC, SET THIS TO FALSE.
 * A landing page must have exactly one exit. This switcher is a second one, and
 * it is the kind of thing that quietly ships and costs conversions. One flag,
 * one edit, deliberately not scattered through the template.
 */
const SHOW_ON_LANDING = true

// /demo is always suppressed: you are already looking at the directory.
const hidden = computed(
  () => route.path === '/demo' || (!SHOW_ON_LANDING && route.path.startsWith('/lp/')),
)

const isCurrent = (to?: string) => to === route.path

/** The module the current page belongs to, so the sheet opens oriented. */
const currentGroupKey = computed(
  () => groups.find((g) => g.entries.some((e) => e.to === route.path))?.key ?? null,
)
const currentGroup = computed(
  () => groups.find((g) => g.key === currentGroupKey.value)?.title ?? null,
)

/* Colour and collapse ----------------------------------------------- *
 * Wide: every group is open, and each carries a tinted heading bar in its
 * own tone so the eye can find a module without reading.
 *
 * The tint is on the bar, not the text. Measured first: of the eight tone
 * foregrounds, only blue, violet and indigo clear 4.5:1 for small text;
 * pink, green and orange fail on both tile and white. So the colour is
 * carried by a surface and the label stays ink. Never a side stripe.
 *
 * Narrow: the sheet is one long scroll, so groups collapse to their bars
 * and only the module you are currently in opens.                       */
const NARROW = '(max-width: 719px)'
const isNarrow = ref(false)
let mq: MediaQueryList | null = null
const onMq = (e: MediaQueryListEvent) => (isNarrow.value = e.matches)

onMounted(() => {
  mq = window.matchMedia(NARROW)
  isNarrow.value = mq.matches
  mq.addEventListener('change', onMq)
})

const openGroups = ref(new Set<string>())

/** Wide screens ignore the collapse state entirely. */
const isGroupOpen = (key: string) => !isNarrow.value || openGroups.value.has(key)

function toggleGroup(key: string) {
  const next = new Set(openGroups.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  openGroups.value = next
}

const liveCountOf = (key: string) =>
  groups.find((g) => g.key === key)?.entries.filter((e) => e.status === 'live').length ?? 0

// The heading is a link to the module's own landing screen, so the title is a
// shortcut and not just a label. Resolved once: resolveComponent is only valid
// during setup or render, not inside a helper called per group.
const NuxtLinkComponent = resolveComponent('NuxtLink')

function groupLinkTag(group: DemoGroup) {
  if (!group.primaryTo) return 'span'
  return group.primaryExternal ? 'a' : NuxtLinkComponent
}

function groupLinkAttrs(group: DemoGroup): Record<string, unknown> {
  if (!group.primaryTo) return {}
  return group.primaryExternal
    ? { href: group.primaryTo, target: '_blank', rel: 'noopener' }
    : { to: group.primaryTo }
}

// Escape has to be bound on the document. Bound to the overlay it never fires,
// because the overlay is not focusable and keydown goes to the focused element.
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

watch(open, async (isOpen) => {
  if (isOpen) {
    // Open oriented: on a narrow screen only the module you are standing in
    // is expanded, so the sheet starts as a short list of seven bars rather
    // than a 29-item scroll.
    openGroups.value = new Set(currentGroupKey.value ? [currentGroupKey.value] : [])
    document.addEventListener('keydown', onKeydown)
    await nextTick()
    closeEl.value?.focus()
  }
  else {
    document.removeEventListener('keydown', onKeydown)
    tabEl.value?.focus()
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  mq?.removeEventListener('change', onMq)
})
</script>

<template>
  <div v-if="!hidden">
    <!-- Resting tab, bottom centre. 40% until you go looking for it. -->
    <button
      ref="tabEl"
      type="button"
      class="fixed z-50 inline-flex items-center gap-2 font-bold text-white opacity-40 hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      :aria-expanded="open"
      aria-controls="demo-nav-panel"
      aria-label="Open the prototype screen switcher"
      :style="{
        left: '50%',
        bottom: '0',
        transform: 'translateX(-50%)',
        padding: '9px 20px 11px',
        borderRadius: '14px 14px 0 0',
        background: 'var(--color-ink)',
        boxShadow: 'var(--shadow-badge)',
        fontSize: '12px',
        letterSpacing: '.1em',
        textTransform: 'uppercase',
      }"
      @click="open = true"
    >
      <span aria-hidden="true" style="font-size: 10px">▲</span>
      Screens
    </button>

    <!-- Sheet, sliding up from the bottom edge -->
    <Transition name="demo-sheet">
      <div v-if="open" class="fixed inset-0 z-50">
        <div class="demo-sheet-scrim absolute inset-0" style="background: rgba(30, 35, 72, 0.38)" @click="open = false" />

        <aside
          id="demo-nav-panel"
          class="demo-sheet-panel absolute left-0 right-0 bottom-0 flex flex-col"
          :style="{
            maxHeight: 'min(72vh, 620px)',
            background: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border)',
            borderRadius: '20px 20px 0 0',
            boxShadow: 'var(--shadow-modal)',
          }"
        >
          <header
            class="flex items-center gap-3 shrink-0"
            :style="{ padding: '16px 22px 13px', borderBottom: '1px solid var(--color-border)' }"
          >
            <div class="min-w-0">
              <div class="font-display font-semibold text-ink" style="font-size: 16px">
                Prototype screens
              </div>
              <div v-if="currentGroup" class="text-muted truncate" style="font-size: 12.5px">
                You are in {{ currentGroup }}
              </div>
            </div>

            <!-- Only once something has actually been changed. Before that it
                 would advertise a mess the walkthrough has not made yet. -->
            <button
              v-if="demo.hasEdits"
              type="button"
              class="ml-auto shrink-0 font-bold text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              :style="{
                padding: '7px 13px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '12px',
                border: '1px solid var(--color-border-input)',
                background: 'var(--color-surface-subtle)',
              }"
              @click="resetDemo"
            >
              Reset demo data
            </button>

            <!-- A primary action, not a footnote: going back to the module
                 overview is the most common thing to want from here. -->
            <AppButton
              to="/demo"
              variant="gradient"
              size="sm"
              pill
              class="shrink-0"
              :class="demo.hasEdits ? '' : 'ml-auto'"
            >
              See full directory
            </AppButton>

            <button
              ref="closeEl"
              type="button"
              class="grid place-items-center text-ink shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              aria-label="Close the screen switcher"
              :style="{
                width: '34px',
                height: '34px',
                borderRadius: '11px',
                border: '1px solid var(--color-border-input)',
                fontSize: '14px',
              }"
              @click="open = false"
            >
              <UIcon name="i-fluent-dismiss-20-regular" :style="{ width: '16px', height: '16px' }" />
            </button>
          </header>

          <!-- CSS columns, not grid. A bottom sheet has width to spare, but on a
               grid every row takes the height of its tallest section, which
               stranded the short modules far down the sheet. Columns flow. -->
          <div
            class="grow overflow-y-auto demo-sheet-cols"
            style="padding: 16px 22px 24px"
          >
            <section v-for="group in groups" :key="group.key">
              <!-- The tinted bar IS the group's colour. Two targets, not one:
                   the title goes to the module's own screen, the chevron
                   collapses the list. Making the whole bar do both meant you
                   could not reach a module without opening its list first. -->
              <div
                class="flex items-center gap-1"
                :style="{
                  padding: '2px',
                  borderRadius: '10px',
                  background: toneTile(group.tone),
                  marginBottom: '6px',
                }"
              >
                <component
                  :is="groupLinkTag(group)"
                  v-bind="groupLinkAttrs(group)"
                  class="flex items-center gap-2 grow min-w-0 no-underline font-bold text-ink"
                  :style="{
                    fontSize: '12.5px',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    cursor: group.primaryTo ? 'pointer' : 'default',
                  }"
                >
                  <UIcon :name="group.icon" aria-hidden="true" :style="{ width: '14px', height: '14px' }" class="shrink-0" />
                  <span class="min-w-0 truncate">{{ group.title }}</span>
                  <span
                    v-if="group.primaryTo"
                    aria-hidden="true"
                    class="ml-auto shrink-0"
                    style="font-size: 11px"
                  >{{ group.primaryExternal ? '↗' : '→' }}</span>
                </component>

                <button
                  v-if="isNarrow"
                  type="button"
                  class="shrink-0 font-bold text-ink"
                  :aria-expanded="isGroupOpen(group.key)"
                  :aria-controls="`demo-group-${group.key}`"
                  :aria-label="`${isGroupOpen(group.key) ? 'Collapse' : 'Expand'} ${group.title}`"
                  style="font-size: 10px; padding: 7px 9px; border-radius: 8px"
                  @click="toggleGroup(group.key)"
                >
                  {{ liveCountOf(group.key) }} {{ isGroupOpen(group.key) ? '▾' : '▸' }}
                </button>
              </div>

              <div v-if="isGroupOpen(group.key)" :id="`demo-group-${group.key}`">

              <template v-for="entry in group.entries" :key="entry.label">
                <!-- Documents are files, so a plain anchor in a new tab: a
                     router link to a PDF navigates to a 404. -->
                <a
                  v-if="entry.to && entry.external"
                  :href="entry.to"
                  target="_blank"
                  rel="noopener"
                  class="flex items-center gap-2 no-underline"
                  :style="{
                    padding: '8px 11px',
                    borderRadius: '10px',
                    fontSize: '13.5px',
                    fontWeight: '600',
                    color: 'var(--color-text-body)',
                  }"
                >
                  {{ entry.label }}
                  <span class="ml-auto shrink-0 text-faint" style="font-size: 11px" aria-hidden="true">↗</span>
                </a>

                <NuxtLink
                  v-else-if="entry.to"
                  :to="entry.to"
                  class="flex items-center gap-2 no-underline"
                  :style="{
                    padding: '8px 11px',
                    borderRadius: '10px',
                    fontSize: '13.5px',
                    fontWeight: isCurrent(entry.to) ? '800' : '600',
                    // Tinted in its own module's tone, with ink text: the tone
                    // foregrounds do not all clear 4.5:1 at this size.
                    background: isCurrent(entry.to) ? toneTile(group.tone) : 'transparent',
                    color: isCurrent(entry.to) ? 'var(--color-ink)' : 'var(--color-text-body)',
                  }"
                >
                  {{ entry.label }}
                  <span
                    v-if="isCurrent(entry.to)"
                    class="ml-auto font-bold shrink-0"
                    style="font-size: 9.5px; letter-spacing: .08em; text-transform: uppercase"
                  >here</span>
                </NuxtLink>

                <div
                  v-else
                  class="flex items-center gap-2"
                  :style="{ padding: '8px 11px', borderRadius: '10px', fontSize: '13.5px', color: 'var(--color-faint)' }"
                >
                  <span class="min-w-0 truncate">{{ entry.label }}</span>
                  <span
                    class="ml-auto font-bold shrink-0"
                    :style="{
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '9.5px',
                      letterSpacing: '.06em',
                      textTransform: 'uppercase',
                      background: 'var(--color-tile-inactive)',
                      color: 'var(--color-fg-inactive)',
                    }"
                  >planned</span>
                </div>
              </template>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Grid, not CSS columns. Column flow packed sections wherever they fit, so a
   short module ended up stacked under a tall one and the eye had to hunt for
   where a group started. One section, one column, full width of that column. */
.demo-sheet-cols {
  display: grid;
  gap: var(--space-md) 18px;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  align-content: start;
}

.demo-sheet-enter-active .demo-sheet-panel,
.demo-sheet-leave-active .demo-sheet-panel {
  transition: transform 0.26s cubic-bezier(0.32, 0.72, 0, 1);
}
.demo-sheet-enter-from .demo-sheet-panel,
.demo-sheet-leave-to .demo-sheet-panel {
  transform: translateY(100%);
}

.demo-sheet-enter-active .demo-sheet-scrim,
.demo-sheet-leave-active .demo-sheet-scrim {
  transition: opacity 0.26s ease;
}
.demo-sheet-enter-from .demo-sheet-scrim,
.demo-sheet-leave-to .demo-sheet-scrim {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .demo-sheet-enter-active .demo-sheet-panel,
  .demo-sheet-leave-active .demo-sheet-panel,
  .demo-sheet-enter-active .demo-sheet-scrim,
  .demo-sheet-leave-active .demo-sheet-scrim {
    transition: none;
  }
}
</style>
