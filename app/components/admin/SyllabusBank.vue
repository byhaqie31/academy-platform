<script setup lang="ts">
import IconTile from '~/components/ui/IconTile.vue'
import { useSubjects } from '~/composables/useSubjects'
import type { SyllabusRow } from '~/types'

const props = defineProps<{ items: SyllabusRow[]; selected: number }>()
defineEmits<{ select: [i: number] }>()

const subjects = useSubjects()
</script>

<template>
  <div
    class="grid"
    :style="{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }"
  >
    <button
      v-for="([name, classes, materials], i) in props.items"
      :key="name"
      type="button"
      class="bg-surface text-left cursor-pointer transition-colors"
      :style="{
        border:
          i === props.selected
            ? '1.5px solid var(--color-dashed)'
            : '1px solid var(--color-border)',
        borderRadius: '18px',
        padding: '18px',
      }"
      @click="$emit('select', i)"
    >
      <IconTile
        :icon="subjects.byName(name)?.icon ?? '📘'"
        :tone="subjects.toneOf(name)"
        :size="46"
        :radius="14"
      />
      <div class="font-bold text-ink" style="font-size: 14.5px; margin-top: 12px; margin-bottom: 3px">
        {{ name }}
      </div>
      <div class="text-muted font-semibold" style="font-size: 11.5px">
        {{ classes }} classes · {{ materials }} materials
      </div>
    </button>
  </div>
</template>
