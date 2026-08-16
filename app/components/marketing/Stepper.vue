<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ step: number; total: number }>()

// One short label per step, in Malay: this is a page a parent reads. No branch
// step, because Hz is fully online, so the wizard is five steps.
const labels = ['Ibu bapa', 'Pelajar', 'Subjek', 'Jadual', 'Hantar']

const items = computed(() =>
  Array.from({ length: props.total }, (_, i) => {
    const done = i < props.step
    const active = i === props.step
    return { i, done, active, label: labels[i] ?? String(i + 1) }
  }),
)

function dotStyle(it: { done: boolean; active: boolean }) {
  if (it.done) return { background: 'var(--color-whatsapp-soft, #34C77B)', color: '#fff' }
  if (it.active) return { background: 'var(--brand-gradient)', color: '#fff' }
  return { background: 'var(--color-divider)', color: 'var(--color-faint)' }
}
</script>

<template>
  <div>
    <!-- dots / segments -->
    <div
      class="flex items-center"
      :style="{ gap: '6px', overflowX: 'auto', paddingBottom: '4px' }"
    >
      <div
        v-for="it in items"
        :key="it.i"
        class="flex flex-col items-center"
        :style="{ flex: 'none', gap: '6px' }"
      >
        <div
          class="grid place-items-center font-display font-bold"
          :style="{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            fontSize: '13.5px',
            ...dotStyle(it),
          }"
        >
          {{ it.done ? '✓' : it.i + 1 }}
        </div>
        <span
          class="font-bold whitespace-nowrap"
          :style="{
            fontSize: '10.5px',
            color: it.active ? 'var(--color-brand-deep)' : 'var(--color-faint)',
          }"
        >
          {{ it.label }}
        </span>
      </div>
    </div>

    <div
      class="font-semibold"
      :style="{ fontSize: '12.5px', color: 'var(--color-muted)', marginTop: '4px' }"
    >
      Step {{ step + 1 }} of {{ total }}
    </div>
  </div>
</template>
