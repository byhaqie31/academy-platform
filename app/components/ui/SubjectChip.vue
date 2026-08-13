<script setup lang="ts">
import { computed } from 'vue'
import { useSubjects } from '~/composables/useSubjects'
import { pillStyle } from '~/utils/status'

const props = withDefaults(defineProps<{ subject: string; size?: 'sm' | 'full' }>(), {
  size: 'sm',
})
const subjects = useSubjects()
const meta = computed(() => subjects.byName(props.subject))
const tone = computed(() => meta.value?.tone ?? 'violet')
</script>

<template>
  <span
    class="inline-flex items-center font-bold whitespace-nowrap"
    :style="{
      padding: size === 'sm' ? '3px 8px' : '5px 11px',
      borderRadius: size === 'sm' ? '7px' : '999px',
      fontSize: size === 'sm' ? '10.5px' : '11.5px',
      gap: '4px',
      ...pillStyle(tone),
    }"
  >
    <UIcon
      v-if="size === 'full' && meta"
      :name="meta.fluentIcon"
      class="inline-block align-[-2px]"
      :style="{ width: '13px', height: '13px' }"
    />
    {{ size === 'sm' ? meta?.short ?? subject : subject }}
  </span>
</template>
