<script setup lang="ts">
// THE RULE THAT DEFINES A LANDING PAGE: no navigation.
//
// No header menu, no footer link farm, one exit. A menu on a landing page
// typically costs 10 to 30 percent of conversions, because it hands a visitor
// who was about to enquire somewhere else to click.
//
// The brand mark is NOT gone, it moved into LandingHero so it sits inside the
// hero wash. A masthead in this layout sat on white above a tinted hero, which
// drew a hard seam across the top of the page and made a landing page read as
// a site page. The mark is still a logo and still NOT a link: making it one is
// the easy mistake that quietly reopens the exit.
//
// This layout must never import SiteHeader or SiteFooter.
</script>

<template>
  <div class="min-h-screen" :style="{ background: 'var(--color-surface)' }">
    <main>
      <slot />
    </main>
  </div>
</template>
