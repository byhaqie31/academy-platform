<script setup lang="ts">
// The dark claims strip, on one line that scrolls itself.
//
// Wrapped, these four claims take three stacked lines on a phone and push the
// testimonials below the fold. One scrolling line keeps the strip the height of
// a strip at every width.

defineProps<{ claims: string[] }>()
</script>

<template>
  <section class="hz-marquee" :style="{ background: 'var(--color-ink)' }">
    <div class="hz-marquee-track">
      <!-- Two identical runs. The animation travels exactly half the track, so
           the second run is under the cursor at the moment the first wraps and
           the loop has no visible seam. Only the first run is real content;
           the second is decoration as far as a screen reader is concerned. -->
      <template v-for="copy in 2" :key="copy">
        <span
          v-for="claim in claims"
          :key="`${copy}-${claim}`"
          class="hz-marquee-item"
          :aria-hidden="copy === 2 ? 'true' : undefined"
        >
          <b class="text-white" style="font-size: 14px; white-space: nowrap">{{ claim }}</b>
          <span
            aria-hidden="true"
            :style="{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: 'var(--color-accent-pink)',
            }"
          />
        </span>
      </template>
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
  /* max-content, so the track is as wide as both runs rather than the section:
     a percentage translate has to resolve against the full two-run width. */
  width: max-content;
  padding: 18px 0;
  animation: hz-marquee-scroll 30s linear infinite;
}

.hz-marquee-item {
  display: flex;
  align-items: center;
  gap: 26px;
  padding-right: 26px;
}

/* Reading a claim that is sliding away is annoying, so hovering holds it. */
.hz-marquee:hover .hz-marquee-track {
  animation-play-state: paused;
}

@keyframes hz-marquee-scroll {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hz-marquee-track {
    animation: none;
  }
  /* Without the scroll the far claims are unreachable, so hand them back. */
  .hz-marquee {
    overflow-x: auto;
  }
}
</style>
