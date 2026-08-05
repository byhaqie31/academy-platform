<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import LogoMark from '~/components/ui/LogoMark.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { useAcademy } from '~/composables/useAcademy'
import { useSiteNav } from '~/composables/useSiteNav'

// No login here, deliberately. A visitor arriving from an ad should see a page
// selling classes, not a login form. The portal door is in the footer.
const { academy } = useAcademy()
const { items, cta, brandSub } = useSiteNav()

const open = ref(false)
const route = useRoute()
watch(() => route.path, () => (open.value = false))

/** Past this many pixels the full-bleed bar collapses into a floating pill. */
const FLOAT_AT = 28

const floating = ref(false)
/** Gates the transitions, so a reload halfway down the page snaps to the pill
 *  instead of playing the collapse as if the visitor had just scrolled. */
const ready = ref(false)

let onScroll: (() => void) | null = null

onMounted(() => {
  onScroll = () => (floating.value = window.scrollY > FLOAT_AT)
  onScroll()

  // Lenis drives the real document scroll, so the native event still fires and
  // this header stays independent of whether the layout mounted its motion.
  window.addEventListener('scroll', onScroll, { passive: true })
  requestAnimationFrame(() => requestAnimationFrame(() => (ready.value = true)))
})

onBeforeUnmount(() => {
  if (onScroll) window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header
    class="site-header"
    :class="{ 'is-floating': floating, 'is-open': open, 'is-ready': ready }"
  >
    <!-- Full-bleed white bar. Fades out as the pill fades in. -->
    <div class="site-header__backdrop" aria-hidden="true" />

    <div class="site-header__track">
      <div class="site-header__shell">
        <div class="site-header__row">
          <NuxtLink to="/" class="site-header__brand flex items-center gap-3 no-underline">
            <LogoMark :size="40" />
            <span>
              <span class="block font-display font-bold text-ink" style="font-size: 18px">
                {{ academy.name }}
              </span>
              <span
                class="block text-muted font-bold"
                style="font-size: 10px; letter-spacing: .16em; text-transform: uppercase; margin-top: -2px"
              >
                {{ brandSub }}
              </span>
            </span>
          </NuxtLink>

          <nav class="site-header__nav hidden lg:flex items-center gap-1">
            <NuxtLink
              v-for="item in items"
              :key="item.to"
              :to="item.to"
              class="no-underline font-bold text-ink-soft transition-colors hover:text-brand-deep"
              active-class="text-brand-deep"
              :style="{ padding: '9px 13px', borderRadius: 'var(--radius-pill)', fontSize: '14px' }"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>

          <div class="site-header__end flex items-center gap-2.5">
            <!-- Wrapper carries the breakpoint: AppButton sets display on its own
                 root, so a `hidden` passed in as a class would not win. -->
            <span class="hidden sm:block">
              <AppButton :to="cta.to" variant="gradient" pill class="whitespace-nowrap">
                {{ cta.label }}
              </AppButton>
            </span>
            <button
              type="button"
              class="lg:hidden grid place-items-center text-ink"
              :aria-expanded="open"
              aria-controls="site-menu"
              :aria-label="open ? 'Tutup menu' : 'Buka menu'"
              :style="{
                width: '42px',
                height: '42px',
                borderRadius: '13px',
                border: '1.5px solid var(--color-border-input)',
                fontSize: '17px',
              }"
              @click="open = !open"
            >
              {{ open ? '✕' : '☰' }}
            </button>
          </div>
        </div>

        <!-- Inside the shell, so the drawer floats with the pill rather than
             hanging off a bar that is no longer full width. -->
        <nav v-show="open" id="site-menu" class="site-header__menu lg:hidden">
          <NuxtLink
            v-for="item in items"
            :key="item.to"
            :to="item.to"
            class="no-underline font-bold text-ink-soft"
            active-class="text-brand-deep"
            :style="{ padding: '13px 12px', borderRadius: '13px', fontSize: '15px' }"
          >
            {{ item.label }}
          </NuxtLink>
          <span class="block sm:hidden mt-2">
            <AppButton :to="cta.to" variant="gradient" pill block>
              {{ cta.label }}
            </AppButton>
          </span>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 40;
}

.site-header__backdrop {
  position: absolute;
  inset: 0;
  background-color: rgb(255 255 255 / 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border-marketing);
}

/* Carries the side gutter the pill needs on narrow screens, where the shell's
   max-width never binds. Kept off the header itself because the backdrop is
   positioned against the header's padding box. */
.site-header__track {
  position: relative;
  padding-inline: 0;
}

.site-header__shell {
  max-width: 1280px;
  margin-inline: auto;
  padding: 12px 22px;
  /* Transparent at rest so the box never changes size when the pill border
     appears, which would otherwise jitter the width transition. */
  border: 1px solid transparent;
  border-radius: 0;
  background-color: transparent;
}

/* Below lg there is no nav to centre, and the grid would actively hurt: equal
   `1fr` side columns squeeze the brand block down to the width of the 42px
   hamburger, wrapping the wordmark onto two lines. */
.site-header__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

/* 1fr auto 1fr centres the nav on the page no matter how wide the brand block
   or the CTA get. Columns are placed explicitly so the layout does not depend
   on source order. */
@media (width >= 64rem) {
  .site-header__row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    column-gap: 20px;
  }
}

.site-header__brand {
  grid-column: 1;
  justify-self: start;
}

.site-header__nav {
  grid-column: 2;
  justify-self: center;
}

.site-header__end {
  grid-column: 3;
  justify-self: end;
}

.site-header__menu {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--color-border-marketing);
}

/* ---- Floating state ---------------------------------------------------- *
 * The gap from the top edge is a transform, never a margin. The header is
 * sticky, so growing its height mid-scroll would reflow the document beneath
 * it and can oscillate around the threshold.
 * ------------------------------------------------------------------------ */
.site-header.is-floating .site-header__backdrop {
  opacity: 0;
}

.site-header.is-floating .site-header__track {
  padding-inline: 12px;
}

.site-header.is-floating .site-header__shell {
  max-width: 1080px;
  padding-inline: 18px;
  border-radius: var(--radius-pill);
  border-color: var(--color-border-marketing);
  /* Solid, not glass. @nuxt/ui sets `isolation: isolate` on #__nuxt, which forms
     a backdrop root, so backdrop-filter is inert everywhere in this app: A/B
     screenshots of blur(14px) vs none are pixel-identical. A translucent pill
     with no blur just leaks hero copy through the nav, so it stays opaque. */
  background-color: var(--color-surface);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(14px);
}

/* A tall pill reads as a mistake, so the open drawer squares off to a card. */
.site-header.is-floating.is-open .site-header__shell {
  border-radius: 24px;
}

@media (prefers-reduced-motion: no-preference) {
  .site-header.is-ready .site-header__backdrop {
    transition: opacity 320ms ease;
  }

  .site-header.is-ready .site-header__track {
    transition: padding-inline 480ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .site-header.is-ready .site-header__shell {
    transition:
      max-width 480ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 480ms cubic-bezier(0.16, 1, 0.3, 1),
      padding-inline 480ms cubic-bezier(0.16, 1, 0.3, 1),
      border-radius 360ms ease,
      border-color 360ms ease,
      background-color 360ms ease,
      box-shadow 360ms ease;
  }
}
</style>
