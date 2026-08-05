<script setup lang="ts">
import type { SitePoint } from '~/types'

// The tinted aside used on /subjects, /how-it-works and /tutors: a bolded lead
// clause with a paragraph under it.
defineProps<{ note: SitePoint; compact?: boolean }>()
</script>

<template>
  <div
    :style="{
      background: 'var(--color-surface-lavender)',
      border: '1px solid var(--color-border-input)',
      borderRadius: compact ? 'var(--radius-tile)' : '18px',
      padding: compact ? '16px 18px' : '22px 24px',
      fontSize: compact ? '14px' : '15.5px',
      lineHeight: '1.65',
      color: 'var(--color-text-body)',
    }"
  >
    <b class="text-ink">{{ note.lead }}</b>
    <span v-if="note.body" class="block" style="margin-top: 6px">{{ note.body }}</span>
  </div>
</template>
