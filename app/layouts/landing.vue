<script setup lang="ts">
import LogoMark from '~/components/ui/LogoMark.vue'
import { useAcademy } from '~/composables/useAcademy'
import { useSiteNav } from '~/composables/useSiteNav'

// THE RULE THAT DEFINES A LANDING PAGE: no navigation.
//
// No header menu, no footer link farm, one exit. A menu on a landing page
// typically costs 10 to 30 percent of conversions, because it hands a visitor
// who was about to enquire somewhere else to click.
//
// The masthead is a logo and it is NOT a link. Deliberately not a NuxtLink:
// making it one is the easy mistake that quietly reopens the exit.
//
// This layout must never import SiteHeader or SiteFooter.
const { academy } = useAcademy()
const { brandSub } = useSiteNav()
</script>

<template>
  <div class="min-h-screen" :style="{ background: 'var(--color-surface)' }">
    <div class="mx-auto flex items-center gap-3" style="max-width: 1060px; padding: 20px 22px 6px">
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
    </div>

    <main>
      <slot />
    </main>
  </div>
</template>
