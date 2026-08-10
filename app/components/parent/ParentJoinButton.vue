<script setup lang="ts">
import { computed } from 'vue'
import type { ParentClassRow } from '~/composables/useParentPortal'
import { dayMs } from '~/utils/day'

const props = defineProps<{ row: ParentClassRow }>()

/**
 * Four states, and getting them right is most of the parent experience.
 * The button stays live until the class ends, never fifteen minutes after it
 * starts, because a parent who pays at 8:20 must still get their child in.
 */
const state = computed(() => {
  if (!props.row.verdict.allowed) return 'locked'
  if (props.row.live) return 'live'
  if (props.row.today) return 'soon'
  return 'later'
})
</script>

<template>
  <NuxtLink
    v-if="state === 'live'"
    to="/portal/parent"
    class="grid place-items-center font-bold text-white transition-transform hover:-translate-y-px"
    :style="{
      background: 'var(--green-gradient)',
      borderRadius: '13px',
      padding: '12px 18px',
      fontSize: '14.5px',
      boxShadow: '0 8px 20px rgba(37,211,102,.30)',
      width: '100%',
    }"
  >
    Sertai kelas
  </NuxtLink>

  <div
    v-else-if="state === 'soon'"
    class="grid place-items-center font-semibold"
    :style="{
      background: 'var(--color-tile-violet)',
      color: 'var(--color-fg-violet)',
      borderRadius: '13px',
      padding: '12px 18px',
      fontSize: '13.5px',
      width: '100%',
    }"
  >
    Kelas mula {{ row.cls.time }}
  </div>

  <NuxtLink
    v-else-if="state === 'locked'"
    to="/portal/parent/suspended"
    class="flex items-center justify-between gap-3 transition-colors"
    :style="{
      background: 'var(--color-tile-overdue)',
      borderRadius: '13px',
      padding: '11px 14px',
      width: '100%',
    }"
  >
    <span class="font-semibold" :style="{ color: 'var(--color-fg-overdue)', fontSize: '13px' }">
      {{ row.verdict.message }}
    </span>
    <span class="font-bold shrink-0" :style="{ color: 'var(--color-fg-overdue)', fontSize: '13px' }">
      Bayar →
    </span>
  </NuxtLink>

  <div
    v-else
    class="font-semibold text-muted"
    :style="{ fontSize: '13px', padding: '4px 0' }"
  >
    {{ dayMs(row.cls.day) }} · {{ row.cls.time }}
  </div>
</template>
