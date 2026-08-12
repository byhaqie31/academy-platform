<script setup lang="ts">
import { usePortalDemo, type CycleState } from '~/composables/usePortalDemo'
import { useDemoStepSelect } from '~/composables/useDemoStepSelect'

// Demo control, not part of the product. The one list of cycle steps,
// rendered by the desktop panel and the mobile sheet.
const demo = usePortalDemo()
const select = useDemoStepSelect()
const emit = defineEmits<{ selected: [] }>()

function pick(key: CycleState) {
  select(key)
  emit('selected')
}
</script>

<template>
  <div>
    <div class="flex flex-col" :style="{ gap: '6px' }">
      <button
        v-for="s in demo.steps"
        :key="s.key"
        type="button"
        class="flex items-center justify-between gap-2 font-semibold text-left transition-colors"
        :style="{
          padding: '9px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          border: '1px solid transparent',
          background: demo.cycle.value === s.key ? 'var(--color-ink)' : 'var(--color-tile-inactive)',
          color: demo.cycle.value === s.key ? '#fff' : 'var(--color-ink-soft)',
        }"
        @click="pick(s.key)"
      >
        <span>{{ s.label }}</span>
        <span :style="{ fontSize: '10.5px', opacity: 0.75 }">{{ s.day }}</span>
      </button>
    </div>

    <div class="text-faint" :style="{ fontSize: '11px', marginTop: '8px', lineHeight: '1.45' }">
      {{ demo.stepFor(demo.cycle.value).hint }}
    </div>
  </div>
</template>
