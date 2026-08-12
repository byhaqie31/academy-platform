<script setup lang="ts">
import { computed } from 'vue'
import { usePortalDemo, type CycleState } from '~/composables/usePortalDemo'
import { useDemoStepSelect } from '~/composables/useDemoStepSelect'

// Demo control, not part of the product. The one list of cycle steps,
// rendered by the desktop rail (dark) and the mobile sheet (light).
const props = withDefaults(defineProps<{ variant?: 'light' | 'dark' }>(), { variant: 'light' })

const demo = usePortalDemo()
const select = useDemoStepSelect()
const emit = defineEmits<{ selected: [] }>()

const dark = computed(() => props.variant === 'dark')

function pick(key: CycleState) {
  select(key)
  emit('selected')
}

function stepStyle(key: CycleState) {
  const active = demo.cycle.value === key
  if (dark.value) {
    return {
      background: active ? '#fff' : 'rgba(255,255,255,.08)',
      color: active ? 'var(--color-ink)' : 'rgba(255,255,255,.78)',
    }
  }
  return {
    background: active ? 'var(--color-ink)' : 'var(--color-tile-inactive)',
    color: active ? '#fff' : 'var(--color-ink-soft)',
  }
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
          ...stepStyle(s.key),
        }"
        @click="pick(s.key)"
      >
        <span>{{ s.label }}</span>
        <span :style="{ fontSize: '10.5px', opacity: 0.75 }">{{ s.day }}</span>
      </button>
    </div>

    <div
      :style="{
        color: dark ? 'rgba(255,255,255,.55)' : 'var(--color-faint)',
        fontSize: '11px',
        marginTop: '8px',
        lineHeight: '1.45',
      }"
    >
      {{ demo.stepFor(demo.cycle.value).hint }}
    </div>
  </div>
</template>
