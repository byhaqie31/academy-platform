<script setup lang="ts">
import IconTile from '~/components/ui/IconTile.vue'
import type { SiteSubjectCard } from '~/types'

// Shared by the home grid and /subjects. `meta` carries the level range on the
// home page and the stage-specific blurb on the subjects page.
defineProps<{ subject: SiteSubjectCard }>()
</script>

<template>
  <div
    class="flex items-start gap-4"
    :style="{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-card)',
      padding: '20px',
      boxShadow: 'var(--shadow-card)',
    }"
  >
    <IconTile :icon="subject.icon" :tone="subject.tone" :size="44" :radius="14" />
    <span class="min-w-0">
      <b class="block font-display font-semibold text-ink" style="font-size: 16.5px">
        {{ subject.name }}
      </b>
      <span class="block text-muted" style="font-size: 13.5px; line-height: 1.5; margin-top: 2px">
        {{ subject.meta }}
      </span>
    </span>
  </div>
</template>
