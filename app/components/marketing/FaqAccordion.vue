<script setup lang="ts">
import type { Faq } from '~/types'

// Reusable: takes the question and answer pairs as a prop so spec B's landing
// pages render their own five without touching this file. Native <details> so
// it works without JavaScript and stays keyboard accessible for free.
withDefaults(defineProps<{ faqs: Faq[]; openFirst?: boolean }>(), { openFirst: true })
</script>

<template>
  <div>
    <details
      v-for="(faq, i) in faqs"
      :key="faq.q"
      :open="openFirst && i === 0"
      class="group"
      :style="{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '18px',
        padding: '20px 24px',
        marginBottom: '12px',
      }"
    >
      <summary
        class="flex items-center justify-between gap-4 cursor-pointer font-bold text-ink"
        style="font-size: 16px; list-style: none"
      >
        {{ faq.q }}
        <span
          aria-hidden="true"
          class="font-display shrink-0"
          :style="{ fontSize: '22px', lineHeight: '1', color: 'var(--color-brand)' }"
        >
          <span class="group-open:hidden">+</span>
          <span class="hidden group-open:inline">–</span>
        </span>
      </summary>
      <p class="text-muted" style="font-size: 15px; line-height: 1.65; margin-top: 12px">
        {{ faq.a }}
      </p>
    </details>
  </div>
</template>

<style scoped>
/* Safari still paints the default disclosure triangle without this. */
summary::-webkit-details-marker {
  display: none;
}
</style>
