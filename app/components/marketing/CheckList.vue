<script setup lang="ts">
import type { SitePoint } from '~/types'

// Gradient tick list. Accepts plain strings or points with a bolded lead
// clause, so the same component serves the fee inclusions and the long-form
// explanation on /how-it-works.
defineProps<{ items: (string | SitePoint)[]; size?: 'md' | 'lg' }>()

const isPoint = (item: string | SitePoint): item is SitePoint => typeof item !== 'string'
</script>

<template>
  <ul class="list-none" style="margin: 0; padding: 0">
    <li
      v-for="(item, i) in items"
      :key="i"
      class="relative"
      :style="{
        paddingLeft: '29px',
        marginBottom: '11px',
        fontSize: size === 'lg' ? '16.5px' : '15.5px',
        lineHeight: '1.6',
        color: 'var(--color-text-body)',
      }"
    >
      <span
        aria-hidden="true"
        class="absolute grid place-items-center font-bold text-white"
        :style="{
          left: '0',
          top: '4px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'var(--brand-gradient-pp)',
          fontSize: '11px',
        }"
      >✓</span>
      <template v-if="isPoint(item)">
        <b class="text-ink">{{ item.lead }}</b>
        <span v-if="item.body"> {{ item.body }}</span>
      </template>
      <template v-else>{{ item }}</template>
    </li>
  </ul>
</template>
