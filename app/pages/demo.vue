<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import LogoMark from '~/components/ui/LogoMark.vue'
import IconTile from '~/components/ui/IconTile.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { useAcademy } from '~/composables/useAcademy'
import { useDemoIndex } from '~/composables/useDemoIndex'
import type { DemoEntry, DemoGroup } from '~/types'

// Two states, one page.
//   grid     six module cards. What the client sees first, so the prototype
//            reads as a product with parts, not as a list of URLs.
//   expanded one module's screens, with the other five collapsed to a left rail.
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

// Motion, on a showcase surface only. CLAUDE.md keeps GSAP off the portals and
// the rule holds: /demo is neither a dashboard nor a page a parent ever sees.
//
// GSAP Flip morphs the six module tiles between the two layouts. Each tile
// carries a stable data-flip-id, so on expand the clicked card grows into the
// module header while the other five travel to their place in the left rail.
// Without Flip this is a hard cut, because the two states are different DOM.
let ctx: { revert: () => void } | null = null
// Guards against two clicks racing through the async import window. A newer
// click always wins; the older one bails rather than fighting over the DOM.
let seq = 0

/**
 * The element that holds both layouts. Easing *its* height is what stops the
 * footer snapping: the footer follows the stage's height, not the page
 * wrapper's, so locking the wrapper achieved nothing.
 */
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
// left the button dead for ~150ms, which is what makes a morph feel stuck: the
// animation itself was fine, it just started late.
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

  // Interrupt any morph still in flight rather than ignoring the click. A
  // blocking guard here would silently swallow input, which reads as a
  // broken button.
  ctx?.revert()
  ctx = null

  // Ease the page height, because the two layouts differ by well over 100px and
  // letting that land in one frame is a jolt however smooth the tiles are.
  //
  // The lock has to be set synchronously, here, before Vue swaps the DOM.
  // Applying it after nextTick lets the browser paint one frame at the new
  // natural height first, which turns a 124px step into a 564px bounce.
  const wrap = stageEl.value
  const fromH = wrap?.offsetHeight ?? 0
  if (wrap && fromH) {
    wrap.style.height = `${fromH}px`
    // Clipped while it resizes, so the taller layout cannot spill over the
    // footer on its way in. Every tile moves inside the stage, so nothing that
    // should be visible gets cut.
    wrap.style.overflow = 'hidden'
  }

  const state = Flip.getState('[data-flip-id]')
  expandedKey.value = key
  await nextTick()
  if (mine !== seq) {
    if (wrap) wrap.style.cssText = wrap.style.cssText.replace(/height:[^;]+;?|overflow:[^;]+;?/g, '')
    return
  }

  // Measure the new natural height, then restore the lock. Reading in the same
  // synchronous block costs a reflow but never a paint, so nothing flickers.
  let toH = fromH
  if (wrap) {
    wrap.style.height = ''
    toH = wrap.offsetHeight
    wrap.style.height = `${fromH}px`
  }

  ctx = gsap.context(() => {
    if (wrap && fromH && toH && Math.abs(toH - fromH) > 4) {
      gsap.to(wrap, {
        height: toH,
        duration: 0.5,
        ease: 'power2.inOut',
        clearProps: 'height,overflow',
      })
    }
    else if (wrap) {
      wrap.style.height = ''
      wrap.style.overflow = ''
    }

    Flip.from(state, {
      // `targets` is required here. Vue's v-if unmounts the old container
      // entirely, so the elements recorded in the state no longer exist and
      // Flip has to be told to re-query the new DOM by data-flip-id. Without
      // it Flip matches nothing and returns a timeline that completes instantly,
      // which looks exactly like "the animation silently did not run".
      targets: '[data-flip-id]',
      duration: 0.5,
      ease: 'power2.inOut',
      // No `absolute`. It lifts every tile out of flow for the whole morph, so
      // the container collapses to nothing and the page below jumps twice.
      onEnter: (els: Element[]) =>
        gsap.fromTo(
          els,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.34, stagger: 0.02, delay: 0.12, ease: 'power2.out' },
        ),
      onLeave: (els: Element[]) =>
        gsap.to(els, { opacity: 0, duration: 0.18, ease: 'power1.in' }),
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
  <div class="mx-auto" style="max-width: 1100px; padding: 44px 22px 90px">
    <header style="margin-bottom: 34px">
      <div class="flex items-center gap-3" style="margin-bottom: 24px">
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
        class="font-display font-semibold text-ink"
        style="font-size: clamp(1.75rem, 3.4vw, 2.4rem); line-height: 1.15; margin: 0"
      >
        {{ title }}
      </h1>
      <p class="text-muted" style="font-size: 16.5px; line-height: 1.65; margin: 12px 0 0; max-width: 44em">
        {{ intro.lede }}
      </p>

      <div class="flex flex-wrap gap-2.5" style="margin-top: 18px">
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

    </header>

    <!-- The stage holds both states. Its height is what the footer follows, so
         it is the element that gets eased, not the page wrapper. -->
    <div ref="stageEl">
      <!-- How to move around, so nobody has to guess what the buttons do.
           Inside the stage, not the header: removing it from the header snapped
           everything below up by its full height in a single frame. -->
      <dl
        v-if="!expanded"
        style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 14px 22px; margin: 0 0 30px"
      >
        <div v-for="tip in visibleTips" :key="tip.title" class="flex items-start gap-2.5">
          <span aria-hidden="true" style="font-size: 15px; line-height: 1.45">{{ tip.icon }}</span>
          <div>
            <dt class="font-bold text-ink" style="font-size: 13.5px">{{ tip.title }}</dt>
            <dd class="text-muted" style="font-size: 13px; line-height: 1.5; margin: 2px 0 0">
              {{ tip.body }}
            </dd>
          </div>
        </div>
      </dl>

      <!-- ---------------------------------------------------- MODULE GRID -->
      <div
        v-if="!expanded"
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 18px"
    >
      <article
        v-for="group in groups"
        :key="group.key"
        :data-flip-id="`module-${group.key}`"
        class="flex flex-col"
        :style="{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
          padding: '22px',
          boxShadow: 'var(--shadow-card)',
        }"
      >
        <div class="flex items-start gap-3" style="margin-bottom: 13px">
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

        <p class="text-muted grow" style="font-size: 14.5px; line-height: 1.6; margin: 0 0 18px">
          {{ group.note }}
        </p>

        <div class="flex flex-wrap gap-2.5">
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
          :data-flip-id="group.key === expandedKey ? undefined : `module-${group.key}`"
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
        <!-- The morph target: the clicked card grows into this header. -->
        <div
          :data-flip-id="`module-${expanded.key}`"
          class="flex flex-wrap items-start gap-4"
          :style="{
            marginBottom: '20px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card)',
            padding: '22px',
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

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 12px">
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
              padding: '15px 17px',
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
              >→</span>
            </div>
            <p class="text-muted" style="font-size: 13px; line-height: 1.5; margin: 5px 0 0">
              {{ entry.note }}
            </p>
            <code v-if="entry.to" class="block text-faint" style="font-size: 11.5px; margin-top: 7px">{{ entry.to }}</code>
          </component>
        </div>
      </section>
      </div>
    </div>

    <footer
      :style="{
        borderTop: '1px solid var(--color-border)',
        paddingTop: '20px',
        marginTop: '44px',
        fontSize: '13px',
        lineHeight: '1.6',
        color: 'var(--color-muted)',
      }"
    >
      Internal directory, not linked from the public site. Fees, seat counts, tutor photos and
      testimonials are illustrative and not yet confirmed by {{ academy.name }}.
    </footer>
  </div>
</template>
