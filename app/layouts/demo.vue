<script setup lang="ts">
import DemoWatermark from '~/components/ui/DemoWatermark.vue'

// No SiteHeader and no marketing motion. This page is a directory, not part of
// the website, and it should never be mistaken for one.
</script>

<template>
  <div class="min-h-screen" :style="{ background: 'var(--color-bg-app)' }">
    <slot />
    <DemoWatermark />
  </div>
</template>
