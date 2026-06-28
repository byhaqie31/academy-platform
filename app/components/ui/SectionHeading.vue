<script setup lang="ts">
defineProps<{ label?: string; title: string; sub?: string; center?: boolean }>()
</script>

<template>
  <div :class="center ? 'text-center mx-auto max-w-2xl' : ''">
    <span
      v-if="label"
      class="inline-flex items-center font-bold"
      :style="{
        padding: '6px 13px',
        borderRadius: '999px',
        fontSize: '12px',
        background: 'var(--color-tile-violet)',
        color: 'var(--color-fg-violet)',
      }"
    >
      {{ label }}
    </span>
    <h2
      class="font-display font-bold text-ink mt-3 mb-2"
      style="font-size: clamp(1.8rem, 3.4vw, 2.6rem); line-height: 1.1"
    >
      {{ title }}
    </h2>
    <p v-if="sub" class="text-muted" style="font-size: 15px; line-height: 1.6">{{ sub }}</p>
  </div>
</template>
