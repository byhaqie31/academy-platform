<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ pct: number; size?: number }>(), { size: 96 })

// Brand-deep fills the attended slice, the border tint fills the rest.
const ring = computed(
  () =>
    `conic-gradient(var(--color-brand-deep) 0% ${props.pct}%, var(--color-border) ${props.pct}% 100%)`,
)
const inner = computed(() => Math.round(props.size * 0.73))
</script>

<template>
  <div
    class="grid place-items-center shrink-0"
    :style="{ width: size + 'px', height: size + 'px', borderRadius: '50%', background: ring }"
  >
    <div
      class="bg-surface flex flex-col items-center justify-center"
      :style="{ width: inner + 'px', height: inner + 'px', borderRadius: '50%' }"
    >
      <div class="font-display font-bold text-ink" style="font-size: 22px; line-height: 1">
        {{ pct }}%
      </div>
      <div class="font-bold text-faint uppercase" style="font-size: 9.5px; letter-spacing: 0.02em">
        Present
      </div>
    </div>
  </div>
</template>
