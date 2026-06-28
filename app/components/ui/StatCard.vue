<script setup lang="ts">
import IconTile from './IconTile.vue'
import { pillStyle, type PillTone } from '~/utils/status'

withDefaults(
  defineProps<{
    icon: string
    tone?: PillTone
    value: string
    label: string
    sub?: string
    delta?: string
  }>(),
  { tone: 'violet' },
)
</script>

<template>
  <div
    class="bg-surface p-[18px]"
    :style="{ border: '1px solid var(--color-border)', borderRadius: '18px' }"
  >
    <div class="flex items-start justify-between">
      <IconTile :icon="icon" :tone="tone" />
      <span
        v-if="delta"
        class="font-bold"
        :style="{ padding: '4px 9px', borderRadius: '999px', fontSize: '11px', ...pillStyle(tone) }"
      >
        {{ delta }}
      </span>
    </div>
    <div class="mt-3 font-display font-bold text-ink" style="font-size: 30px; line-height: 1.1">
      {{ value }}
    </div>
    <div class="mt-1 font-bold text-ink" style="font-size: 13px">{{ label }}</div>
    <div v-if="sub" class="text-faint" style="font-size: 11.5px; font-weight: 600">{{ sub }}</div>
  </div>
</template>
