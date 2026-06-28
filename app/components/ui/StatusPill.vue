<script setup lang="ts">
import { pillStyle, type PillTone } from '~/utils/status'

defineProps<{ tone: PillTone; label: string }>()
</script>

<template>
  <span
    class="inline-flex items-center font-bold whitespace-nowrap"
    :style="{
      padding: '5px 11px',
      borderRadius: '999px',
      fontSize: '11px',
      ...pillStyle(tone),
    }"
  >
    {{ label }}
  </span>
</template>
