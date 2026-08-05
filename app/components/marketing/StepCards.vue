<script setup lang="ts">
import type { SiteStep } from '~/types'
import { tonePair } from '~/utils/tone'

// Shared by the home page's four steps and /how-it-works' first-week sequence.
defineProps<{ steps: SiteStep[] }>()
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px">
    <div
      v-for="step in steps"
      :key="step.n"
      :style="{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-card)',
        padding: '24px',
        boxShadow: 'var(--shadow-card)',
      }"
    >
      <div
        class="grid place-items-center font-display font-semibold"
        :style="{
          width: '44px',
          height: '44px',
          borderRadius: '14px',
          fontSize: '19px',
          marginBottom: '15px',
          ...tonePair(step.tone),
        }"
      >
        {{ step.n }}
      </div>
      <h3 class="font-display font-semibold text-ink" style="font-size: 18px; margin: 0 0 7px">
        {{ step.title }}
      </h3>
      <p class="text-muted" style="font-size: 14.5px; line-height: 1.55; margin: 0">
        {{ step.body }}
      </p>
    </div>
  </div>
</template>
