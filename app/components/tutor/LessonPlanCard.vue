<script setup lang="ts">
import type { LessonPlan } from '~/types'

// For this tutor every class is Matematik, so the class pill is always the
// Matematik pink tone. Resolve via useClasses().byId if subject ever varies.
defineProps<{ plan: LessonPlan }>()
</script>

<template>
  <article
    class="bg-surface"
    :style="{
      border: '1px solid var(--color-border)',
      borderRadius: '20px',
      padding: '18px',
      display: 'flex',
      flexDirection: 'column',
    }"
  >
    <!-- Class pill, tinted Matematik pink -->
    <span
      class="inline-flex items-center self-start font-bold whitespace-nowrap"
      :style="{
        padding: '5px 11px',
        borderRadius: '999px',
        fontSize: '11.5px',
        background: 'var(--color-tile-pink)',
        color: 'var(--color-fg-pink)',
      }"
    >
      {{ plan.cls }}
    </span>

    <div class="font-bold text-muted uppercase" :style="{ fontSize: '10.5px', letterSpacing: '0.04em', marginTop: '14px' }">
      {{ plan.week }}
    </div>
    <div class="font-display font-bold text-ink" :style="{ fontSize: '15px', marginTop: '3px', lineHeight: '1.25' }">
      {{ plan.topic }}
    </div>
    <div class="text-muted" :style="{ fontSize: '12px', marginTop: '6px' }">
      KPM reference: {{ plan.ref }}
    </div>

    <!-- Attached material chip, or a full-width dashed attach button. -->
    <span
      v-if="plan.attached"
      class="inline-flex items-center self-start font-bold"
      :style="{
        marginTop: '14px',
        padding: '7px 12px',
        borderRadius: '10px',
        fontSize: '12px',
        gap: '5px',
        background: 'var(--color-surface-subtle)',
        color: 'var(--color-ink-soft)',
        border: '1px solid var(--color-border)',
      }"
    >
      📎 {{ plan.material }}
    </span>
    <button
      v-else
      type="button"
      class="inline-flex items-center justify-center font-bold cursor-pointer"
      :style="{
        marginTop: '14px',
        width: '100%',
        padding: '9px 12px',
        borderRadius: '10px',
        fontSize: '12px',
        background: 'transparent',
        color: 'var(--color-brand-deep)',
        border: '1.5px dashed var(--color-dashed)',
      }"
    >
      + Attach material
    </button>
  </article>
</template>
