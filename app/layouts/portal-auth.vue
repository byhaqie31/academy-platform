<script setup lang="ts">
// Deliberately minimal: no SiteHeader, no marketing nav, no GSAP or Lenis.
// The portal is a phase 2 product that happens to have a door on this domain,
// so its door should not look like a marketing page.
</script>

<template>
  <div class="min-h-screen grid place-items-center" :style="{ background: 'var(--color-surface-lavender)' }">
    <main class="w-full" style="max-width: 420px; padding: 32px 22px">
      <slot />
    </main>
  </div>
</template>
