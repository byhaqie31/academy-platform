<script setup lang="ts">
import { pillStyle, type PillTone } from '~/utils/status'
import { isFluentIcon } from '~/utils/icons'

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
    <UIcon
      v-if="isFluentIcon(props.icon)"
      :name="props.icon"
      :style="{ width: props.size * 0.52 + 'px', height: props.size * 0.52 + 'px' }"
    />
    <template v-else>{{ props.icon }}</template>
  </div>
</template>
