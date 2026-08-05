<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import LogoMark from '~/components/ui/LogoMark.vue'
import IconTile from '~/components/ui/IconTile.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { useAcademy } from '~/composables/useAcademy'
import { useDemoIndex } from '~/composables/useDemoIndex'
import type { DemoEntry, DemoGroup } from '~/types'

// Two states, one page.
//   grid     module tiles. What the client sees first, so the prototype reads
//            as a product with parts, not as a list of URLs.
//   expanded one module's screens, with the others collapsed to a left rail.
definePageMeta({ layout: 'demo' })

const { academy } = useAcademy()
const { intro, groups, liveCount, plannedCount } = useDemoIndex()

const expandedKey = ref<string | null>(null)
const expanded = computed(() => groups.find((g) => g.key === expandedKey.value) ?? null)

const title = computed(() => intro.titleTemplate.replace('{academy}', academy.name))

// Tips flagged whenPlanned only make sense while something is still planned.
const visibleTips = computed(() =>
  intro.tips.filter((tip) => !tip.whenPlanned || plannedCount > 0),
)

/* Motion ------------------------------------------------------------ *
 * Only the tile you clicked animates its geometry. Everything else
 * cross-fades.
 *
 * The previous version morphed all seven tiles at once, including
 * card -> thin rail row: a 300px card carrying a title, a note and two
 * buttons interpolating into a 210px list item, with its text reflowing
 * on every frame for half a second. That is what read as cranky.
 *
 * Durations follow the product register (150-250ms). A directory is a
 * tool, and a tool should not make you wait for choreography.            */
const DURATION = 0.24
const EASE = 'power3.out'

let ctx: { revert: () => void } | null = null
// Guards two clicks racing through the async import window. A newer click
// always wins; the older one bails rather than fighting over the DOM.
let seq = 0

/** Holds both layouts. Easing its height is what stops the page jumping. */
const stageEl = ref<HTMLElement | null>(null)

type Motion = { gsap: typeof import('gsap')['gsap'], Flip: typeof import('gsap/Flip')['Flip'] }
let motion: Motion | null = null

async function loadMotion(): Promise<Motion> {
  if (motion) return motion
  const [{ default: gsap }, { Flip }] = await Promise.all([
    import('gsap'),
    import('gsap/Flip'),
  ])
  gsap.registerPlugin(Flip)
  motion = { gsap, Flip }
  return motion
}

// Warm the GSAP chunk while the page is idle. Fetching it on the first click
// left the button dead for ~150ms, which is most of what makes a transition
// feel stuck: the motion was fine, it just started late.
onMounted(() => {
  const warm = () => { void loadMotion() }
  if ('requestIdleCallback' in window) window.requestIdleCallback(warm)
  else setTimeout(warm, 300)
})

async function setExpanded(key: string | null) {
  if (key === expandedKey.value) return

  const reduce = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduce || typeof window === 'undefined') {
    expandedKey.value = key
    return
  }

  const mine = ++seq
  const { gsap, Flip } = await loadMotion()
  if (mine !== seq) return

  // Interrupt any transition still running rather than ignoring the click.
  // A blocking guard would swallow input, which reads as a broken button.
  ctx?.revert()
  ctx = null

  // Ease the stage height so nothing below it jumps. The lock must be set
  // synchronously, before Vue swaps the DOM: applying it after nextTick lets
  // the browser paint one frame at the new natural height first.
  const stage = stageEl.value
  const fromH = stage?.offsetHeight ?? 0
  if (stage && fromH) {
    stage.style.height = `${fromH}px`
    stage.style.overflow = 'hidden'
  }

  const state = Flip.getState('[data-flip-id]')
  expandedKey.value = key
  await nextTick()
  if (mine !== seq) {
    if (stage) stage.style.cssText = stage.style.cssText.replace(/height:[^;]+;?|overflow:[^;]+;?/g, '')
    return
  }

  // Measure the new natural height, then restore the lock. Reading in the
  // same synchronous block costs a reflow but never a paint.
  let toH = fromH
  if (stage) {
    stage.style.height = ''
    toH = stage.offsetHeight
    stage.style.height = `${fromH}px`
  }

  ctx = gsap.context(() => {
    if (stage && fromH && toH && Math.abs(toH - fromH) > 4) {
      gsap.to(stage, {
        height: toH,
        duration: DURATION,
        ease: EASE,
        clearProps: 'height,overflow',
      })
    }
    else if (stage) {
      stage.style.height = ''
      stage.style.overflow = ''
    }

    Flip.from(state, {
      // `targets` is required: Vue's v-if unmounts the old container, so the
      // elements recorded in the state no longer exist and Flip has to
      // re-query by data-flip-id. Without it Flip matches nothing and returns
      // a timeline that completes instantly, which looks exactly like "the
      // animation silently did not run".
      targets: '[data-flip-id]',
      duration: DURATION,
      ease: EASE,
      // No `absolute`: it lifts tiles out of flow for the whole transition, so
      // the container collapses and the page below jumps twice.
      onEnter: (els: Element[]) =>
        gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: DURATION, ease: EASE }),
      onLeave: (els: Element[]) =>
        gsap.to(els, { opacity: 0, duration: DURATION * 0.6, ease: 'power2.in' }),
    })
  })
}

onBeforeUnmount(() => ctx?.revert())

const NuxtLinkComponent = resolveComponent('NuxtLink')

/**
 * A route entry takes `to` (NuxtLink); a document entry takes `href` on a plain
 * anchor. Passing `to` to an <a> renders a link that silently goes nowhere.
 */
function entryLink(entry: DemoEntry): Record<string, unknown> {
  if (!entry.to) return {}
  return entry.external
    ? { href: entry.to, target: '_blank', rel: 'noopener' }
    : { to: entry.to }
}

/** "7 screens", "1 screen", or "2 planned" when nothing in the module is built. */
function countLabel(group: DemoGroup): string {
  const live = group.entries.filter((e) => e.status === 'live').length
  if (live === 0) return `${group.entries.length} planned`
  return `${live} screen${live === 1 ? '' : 's'}`
}

useHead({
  title: `Prototype · ${academy.name}`,
  meta: [{ name: 'robots', content: 'noindex' }],
})
</script>

<template>
  <div
    class="mx-auto"
    :style="{ maxWidth: '1100px', padding: 'var(--space-xl) var(--space-lg) var(--space-3xl)' }"
  >
    <!-- Header and guidance share one band. The guidance used to sit in its own
         four-column grid directly above a seven-column grid of module cards:
         two identical card grids stacked, and ~90px of height for something
         that is a footnote to the task. -->
    <header
      class="grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1fr)_clamp(260px,26vw,320px)] items-start"
      :style="{ marginBottom: 'var(--space-2xl)' }"
    >
      <div>
        <div class="flex items-center gap-3" :style="{ marginBottom: 'var(--space-lg)' }">
          <LogoMark :size="40" />
          <span>
            <span class="block font-display font-bold text-ink" style="font-size: 18px">
              {{ academy.name }}
            </span>
            <span
              class="block text-muted font-bold"
              style="font-size: 10px; letter-spacing: .16em; text-transform: uppercase; margin-top: -2px"
            >
              {{ intro.eyebrow }}
            </span>
          </span>
        </div>

        <h1
          class="font-display font-semibold text-ink text-balance"
          style="font-size: clamp(1.75rem, 3.4vw, 2.4rem); line-height: 1.15; margin: 0"
        >
          {{ title }}
        </h1>
        <p
          class="text-text-body text-pretty"
          :style="{ fontSize: '16.5px', lineHeight: '1.65', margin: 'var(--space-sm) 0 0', maxWidth: '58ch' }"
        >
          {{ intro.lede }}
        </p>

        <div class="flex flex-wrap gap-2" :style="{ marginTop: 'var(--space-md)' }">
          <span
            class="font-bold"
            :style="{
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '12.5px',
              background: 'var(--color-tile-green)',
              color: 'var(--color-fg-green)',
            }"
          >{{ liveCount }} screens live</span>
          <span
            v-if="plannedCount > 0"
            class="font-bold"
            :style="{
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '12.5px',
              background: 'var(--color-tile-violet)',
              color: 'var(--color-fg-violet)',
            }"
          >{{ plannedCount }} planned</span>
        </div>
      </div>

      <!-- Guidance: a quiet aside, one line each, not a second card grid.
           The rule is only a rule while this is genuinely a side column; on
           mobile it stacks and the border would just indent the text. -->
      <aside class="demo-aside">
        <dl style="margin: 0">
          <div
            v-for="tip in visibleTips"
            :key="tip.title"
            class="flex items-baseline gap-2.5"
            :style="{ marginBottom: 'var(--space-sm)' }"
          >
            <span aria-hidden="true" style="font-size: 13px; line-height: 1.5">{{ tip.icon }}</span>
            <div class="min-w-0">
              <dt class="font-bold text-ink" style="font-size: 13px; line-height: 1.5">
                {{ tip.title }}
              </dt>
              <dd class="text-muted" style="font-size: 12.5px; line-height: 1.5; margin: 0">
                {{ tip.body }}
              </dd>
            </div>
          </div>
        </dl>
      </aside>
    </header>

    <div ref="stageEl">
      <!-- ---------------------------------------------------- MODULE GRID -->
      <!-- The lead module spans two columns. Seven equal tiles said every part
           of this weighed the same, which is not true. -->
      <div
        v-if="!expanded"
        class="demo-grid"
      >
        <article
          v-for="group in groups"
          :key="group.key"
          :data-flip-id="`module-${group.key}`"
          class="flex flex-col"
          :class="{ 'demo-grid__feature': group.feature }"
          :style="{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card)',
            padding: 'var(--space-lg)',
            boxShadow: 'var(--shadow-card)',
          }"
        >
          <div class="flex items-start gap-3" :style="{ marginBottom: 'var(--space-sm)' }">
            <IconTile :icon="group.icon" :tone="group.tone" :size="44" :radius="14" />
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="font-display font-semibold text-ink" style="font-size: 18px; margin: 0">
                  {{ group.title }}
                </h2>
                <span
                  v-if="group.badge"
                  class="font-bold shrink-0"
                  :style="{
                    padding: '3px 9px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '10px',
                    letterSpacing: '.06em',
                    textTransform: 'uppercase',
                    background: 'var(--color-tile-inactive)',
                    color: 'var(--color-fg-inactive)',
                  }"
                >{{ group.badge }}</span>
              </div>
              <p class="text-muted" style="font-size: 12.5px; margin: 3px 0 0">
                {{ countLabel(group) }}
              </p>
            </div>
          </div>

          <p
            class="text-muted"
            :style="{ fontSize: '14.5px', lineHeight: '1.6', margin: `0 0 var(--space-md)` }"
          >
            {{ group.note }}
          </p>

          <!-- The lead tile earns its extra column by previewing what is
               inside, rather than being the same card stretched wider. -->
          <div
            v-if="group.feature"
            class="hidden lg:flex flex-wrap gap-1.5"
            :style="{ marginBottom: 'var(--space-md)' }"
          >
            <span
              v-for="entry in group.entries"
              :key="entry.label"
              class="font-semibold"
              :style="{
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '12px',
                background: 'var(--color-surface-lavender)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-ink-soft)',
              }"
            >{{ entry.label }}</span>
          </div>

          <div class="grow" />

          <div class="flex flex-wrap gap-2">
            <AppButton
              v-if="group.primaryTo"
              :to="group.primaryTo"
              :external="group.primaryExternal"
              variant="gradient"
              size="sm"
              pill
            >
              Open
            </AppButton>
            <AppButton variant="outline" size="sm" pill @click="setExpanded(group.key)">
              See screens
            </AppButton>
          </div>
        </article>
      </div>

      <!-- -------------------------------------------------- EXPANDED MODULE -->
      <div v-else class="grid gap-7 lg:grid-cols-[210px_1fr] items-start">
        <!-- The other modules, collapsed to a rail -->
        <nav class="flex flex-col gap-1" aria-label="Modules">
          <button
            type="button"
            class="text-left font-bold text-muted hover:text-brand-deep transition-colors"
            style="font-size: 13px; padding: 8px 11px"
            @click="setExpanded(null)"
          >
            ← All modules
          </button>
          <button
            v-for="group in groups"
            :key="group.key"
            type="button"
            class="flex items-center gap-2.5 text-left transition-colors"
            :style="{
              padding: '9px 11px',
              borderRadius: '11px',
              fontSize: '13.5px',
              fontWeight: group.key === expandedKey ? '800' : '600',
              background: group.key === expandedKey ? 'var(--color-tile-violet)' : 'transparent',
              color: group.key === expandedKey ? 'var(--color-fg-violet)' : 'var(--color-text-body)',
            }"
            @click="setExpanded(group.key)"
          >
            <span aria-hidden="true">{{ group.icon }}</span>
            <span class="min-w-0 truncate">{{ group.title }}</span>
          </button>
        </nav>

        <!-- The expanded module -->
        <section>
          <!-- The morph target: the clicked card grows into this header. It is
               the only element whose geometry animates. -->
          <div
            :data-flip-id="`module-${expanded.key}`"
            class="flex flex-wrap items-start gap-4"
            :style="{
              marginBottom: 'var(--space-lg)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-card)',
              padding: 'var(--space-lg)',
              boxShadow: 'var(--shadow-card)',
            }"
          >
            <IconTile :icon="expanded.icon" :tone="expanded.tone" :size="46" :radius="14" />
            <div class="min-w-0 grow">
              <div class="flex flex-wrap items-center gap-2.5">
                <h2 class="font-display font-semibold text-ink" style="font-size: 21px; margin: 0">
                  {{ expanded.title }}
                </h2>
                <span
                  v-if="expanded.badge"
                  class="font-bold"
                  :style="{
                    padding: '4px 11px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '11px',
                    letterSpacing: '.06em',
                    textTransform: 'uppercase',
                    background: 'var(--color-tile-inactive)',
                    color: 'var(--color-fg-inactive)',
                  }"
                >{{ expanded.badge }}</span>
              </div>
              <p class="text-muted" style="font-size: 14.5px; line-height: 1.55; margin: 4px 0 0">
                {{ expanded.note }}
              </p>
            </div>
            <AppButton
              v-if="expanded.primaryTo"
              :to="expanded.primaryTo"
              :external="expanded.primaryExternal"
              variant="gradient"
              size="sm"
              pill
              class="shrink-0"
            >
              {{ expanded.primaryLabel }}
            </AppButton>
          </div>

          <div class="demo-entries">
            <component
              :is="entry.to ? (entry.external ? 'a' : NuxtLinkComponent) : 'div'"
              v-for="entry in expanded.entries"
              :key="entry.label"
              v-bind="entryLink(entry)"
              class="block no-underline"
              :style="{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-tile)',
                padding: 'var(--space-md)',
                boxShadow: 'var(--shadow-card)',
                opacity: entry.status === 'planned' ? '.68' : '1',
                cursor: entry.to ? 'pointer' : 'default',
              }"
            >
              <div class="flex items-center gap-2">
                <b class="text-ink" style="font-size: 15px">{{ entry.label }}</b>
                <span
                  v-if="entry.status === 'planned'"
                  class="font-bold shrink-0"
                  :style="{
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '10px',
                    letterSpacing: '.06em',
                    textTransform: 'uppercase',
                    background: 'var(--color-tile-inactive)',
                    color: 'var(--color-fg-inactive)',
                  }"
                >planned</span>
                <span
                  v-if="entry.to"
                  class="ml-auto shrink-0 text-faint"
                  style="font-size: 14px"
                  aria-hidden="true"
                >{{ entry.external ? '↗' : '→' }}</span>
              </div>
              <p class="text-muted" style="font-size: 13px; line-height: 1.5; margin: 5px 0 0">
                {{ entry.note }}
              </p>
              <code
                v-if="entry.to"
                class="block text-faint"
                style="font-size: 11.5px; margin-top: 7px"
              >{{ entry.to }}</code>
            </component>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-grid {
  display: grid;
  gap: var(--space-md);
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.demo-entries {
  display: grid;
  gap: var(--space-sm);
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}

/* Stacked on mobile, so no divider: it would read as an indent, not a column. */
@media (min-width: 1024px) {
  .demo-aside {
    border-left: 1px solid var(--color-border);
    padding-left: var(--space-lg);
  }
}

/* The lead module gets the width of two. Only once the grid is genuinely
   multi-column, or it would just be a taller tile on mobile. */
@media (min-width: 900px) {
  .demo-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .demo-grid__feature {
    grid-column: span 2;
  }
}
</style>
