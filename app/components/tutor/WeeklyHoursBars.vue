<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ weeks: number[]; labels: string[] }>()

// Bars scale against the busiest week so the longest reads as full.
const max = computed(() => Math.max(...props.weeks, 1))
const total = computed(() => props.weeks.reduce((t, h) => t + h, 0))
</script>

<template>
  <div
    class="bg-surface"
    :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '22px' }"
  >
    <div class="font-display font-semibold text-ink" style="font-size: 17px; margin-bottom: 16px">
      Pecahan jam mingguan
    </div>

    <div class="flex flex-col" style="gap: 14px">
      <div v-for="(h, i) in weeks" :key="i">
        <div class="flex items-center justify-between" style="margin-bottom: 6px">
          <span class="text-ink" style="font-size: 12.5px; font-weight: 700">{{ labels[i] }}</span>
          <span class="text-muted" style="font-size: 12.5px; font-weight: 700">{{ h }} j</span>
        </div>
        <div
          class="overflow-hidden"
          :style="{ height: '8px', borderRadius: '999px', background: 'var(--color-divider)' }"
        >
          <div
            :style="{
              height: '100%',
              width: (h / max) * 100 + '%',
              borderRadius: '999px',
              background: 'var(--color-brand-deep)',
            }"
          />
        </div>
      </div>

      <div
        class="flex items-center justify-between"
        :style="{ borderTop: '1px solid var(--color-divider)', paddingTop: '12px', marginTop: '2px' }"
      >
        <span class="text-ink" style="font-weight: 800; font-size: 13.5px">Jumlah</span>
        <span class="font-display font-bold text-ink" style="font-size: 16px">{{ total }} j</span>
      </div>
    </div>
  </div>
</template>
