<script setup lang="ts">
import { pillStyle, type PillTone } from '~/utils/status'

const props = withDefaults(
  defineProps<{ icon: string; tone?: PillTone; size?: number; radius?: number }>(),
  { tone: 'violet', size: 42, radius: 13 },
)
</script>

<template>
  <div
    class="grid place-items-center shrink-0"
    :style="{
      width: props.size + 'px',
      height: props.size + 'px',
      borderRadius: props.radius + 'px',
      fontSize: props.size * 0.45 + 'px',
      ...pillStyle(props.tone),
    }"
  >
    {{ props.icon }}
  </div>
</template>
