<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppButton from '~/components/ui/AppButton.vue'
import { useDemoIndex } from '~/composables/useDemoIndex'

// Floating screen switcher for the prototype walkthrough. It rides on top of
// whatever page you are on, so the client can jump between the website, the
// portals and the v1 archive without going back to /demo.
//
// Mounted once in app.vue rather than per layout, which is how it reaches the
// frozen /v1 archive without any file in app/components/v1 being edited.
const { groups } = useDemoIndex()
const route = useRoute()

const open = ref(false)
watch(() => route.path, () => (open.value = false))

const tabEl = ref<HTMLButtonElement | null>(null)
const closeEl = ref<HTMLButtonElement | null>(null)

// Two suppressions, both deliberate:
//   /demo   you are already looking at the directory
//   /lp/*   a landing page has exactly one exit. That rule does not get an
//           exception for our own convenience.
const hidden = computed(() => route.path === '/demo' || route.path.startsWith('/lp/'))

const isCurrent = (to?: string) => to === route.path

/** The module the current page belongs to, so the sheet opens oriented. */
const currentGroup = computed(
  () => groups.find((g) => g.entries.some((e) => e.to === route.path))?.title ?? null,
)

// Escape has to be bound on the document. Bound to the overlay it never fires,
// because the overlay is not focusable and keydown goes to the focused element.
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

watch(open, async (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', onKeydown)
    await nextTick()
    closeEl.value?.focus()
  }
  else {
    document.removeEventListener('keydown', onKeydown)
    tabEl.value?.focus()
  }
})

onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
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

            <!-- A primary action, not a footnote: going back to the module
                 overview is the most common thing to want from here. -->
            <AppButton to="/demo" variant="gradient" size="sm" pill class="ml-auto shrink-0">
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
              ✕
            </button>
          </header>

          <!-- CSS columns, not grid. A bottom sheet has width to spare, but on a
               grid every row takes the height of its tallest section, which
               stranded the short modules far down the sheet. Columns flow. -->
          <div
            class="grow overflow-y-auto demo-sheet-cols"
            style="padding: 16px 22px 24px"
          >
            <section v-for="group in groups" :key="group.key" style="break-inside: avoid; margin-bottom: 14px">
              <div
                class="font-bold text-muted"
                style="font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; padding: 4px 4px 7px"
              >
                {{ group.icon }} {{ group.title }}
              </div>

              <template v-for="entry in group.entries" :key="entry.label">
                <NuxtLink
                  v-if="entry.to"
                  :to="entry.to"
                  class="flex items-center gap-2 no-underline"
                  :style="{
                    padding: '8px 11px',
                    borderRadius: '10px',
                    fontSize: '13.5px',
                    fontWeight: isCurrent(entry.to) ? '800' : '600',
                    background: isCurrent(entry.to) ? 'var(--color-tile-violet)' : 'transparent',
                    color: isCurrent(entry.to) ? 'var(--color-fg-violet)' : 'var(--color-text-body)',
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
            </section>
          </div>
        </aside>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.demo-sheet-cols {
  columns: 210px;
  column-gap: 22px;
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
