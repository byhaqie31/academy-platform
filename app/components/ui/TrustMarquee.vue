<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

// The dark claims strip, shared by the website home page and the campaign
// pages. Wrapped, these claims take two or three stacked lines on a phone and
// push the next section below the fold.
//
// It scrolls only when the claims do not fit. On a desktop width they sit on
// one centred line and nothing moves: motion is here to solve the wrapping, so
// it should not run where there is no wrapping to solve. That measurement is
// also why this is not a plain CSS breakpoint, since whether it fits depends on
// how many claims a surface passes, not on the width alone.

defineProps<{ claims: string[] }>()

const wrapEl = ref<HTMLElement | null>(null)
const runEl = ref<HTMLElement | null>(null)
const scrolling = ref(false)
const wrapped = ref(false)

let ro: ResizeObserver | null = null

function measure() {
  if (!wrapEl.value || !runEl.value) return
  scrolling.value = runEl.value.scrollWidth > wrapEl.value.clientWidth + 1
}

onMounted(() => {
  // Reduced motion falls back to the original wrapping layout. Wrapping costs
  // vertical space; it never costs anyone a claim they cannot read.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    wrapped.value = true
    return
  }
  measure()
  if (wrapEl.value) {
    ro = new ResizeObserver(measure)
    ro.observe(wrapEl.value)
  }
})

onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <section
    ref="wrapEl"
    class="hz-marquee"
    :class="{ 'is-scrolling': scrolling, 'is-wrapped': wrapped }"
    :style="{ background: 'var(--color-ink)' }"
  >
    <div class="hz-marquee-track">
      <span ref="runEl" class="hz-marquee-run">
        <span v-for="claim in claims" :key="claim" class="hz-marquee-item">
          <b class="text-white">{{ claim }}</b>
          <span class="hz-marquee-dot" aria-hidden="true" />
        </span>
      </span>

      <!-- Second run only once scrolling. The animation travels exactly half
           the track, so this one is under the cursor at the moment the first
           wraps and the loop has no seam. Decoration to a screen reader, which
           has already heard the claims once. -->
      <span v-if="scrolling" aria-hidden="true" class="hz-marquee-run">
        <span v-for="claim in claims" :key="`dup-${claim}`" class="hz-marquee-item">
          <b class="text-white">{{ claim }}</b>
          <span class="hz-marquee-dot" aria-hidden="true" />
        </span>
      </span>
    </div>
  </section>
</template>

<style scoped>
.hz-marquee {
  overflow: hidden;
}

.hz-marquee-track {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 0;
}

.hz-marquee-run {
  display: flex;
  align-items: center;
  gap: 26px;
  /* 13px a side, so the join between the two runs measures the same 26px as
     the gaps inside one. */
  padding: 0 13px;
}

.hz-marquee-item {
  display: flex;
  align-items: center;
  gap: 26px;
  font-size: 14px;
  white-space: nowrap;
}

.hz-marquee-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-accent-pink);
}

/* Centred and still: the claims already fit. */
.hz-marquee:not(.is-scrolling) .hz-marquee-item:last-child .hz-marquee-dot {
  display: none;
}

.hz-marquee.is-scrolling .hz-marquee-track {
  /* max-content, so a percentage translate resolves against both runs rather
     than against the section. */
  width: max-content;
  justify-content: flex-start;
  animation: hz-marquee-scroll 30s linear infinite;
}

/* Reading a claim that is sliding away is annoying, so hovering holds it. */
.hz-marquee.is-scrolling:hover .hz-marquee-track {
  animation-play-state: paused;
}

@keyframes hz-marquee-scroll {
  to {
    transform: translateX(-50%);
  }
}

/* Reduced motion: the layout this replaced. */
.hz-marquee.is-wrapped .hz-marquee-run {
  flex-wrap: wrap;
  justify-content: center;
  row-gap: 10px;
  padding: 0 22px;
}
</style>
