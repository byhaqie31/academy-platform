<script setup lang="ts">
import { useAcademy } from '~/composables/useAcademy'
import IconTile from '~/components/ui/IconTile.vue'
import type { Class } from '~/types'

const props = defineProps<{ cls: Class }>()
const { branchShort } = useAcademy()
</script>

<template>
  <NuxtLink
    :to="`/tutor/classes/${props.cls.id}`"
    class="block no-underline bg-surface transition-all duration-150 hover:-translate-y-px"
    :style="{
      border: '1px solid var(--color-border)',
      borderRadius: '20px',
      padding: '20px',
    }"
  >
    <div class="flex items-center justify-between" style="margin-bottom: 14px">
      <IconTile icon="i-fluent-calculator-24-regular" tone="pink" :size="46" :radius="14" />
      <span
        class="font-bold text-ink-soft"
        :style="{
          padding: '5px 11px',
          borderRadius: '999px',
          background: 'var(--color-surface-subtle)',
          fontSize: '11px',
        }"
      >
        {{ props.cls.roster.length }} students
      </span>
    </div>

    <div class="font-bold text-ink" style="font-size: 15.5px">
      Matematik · {{ props.cls.cls }}
    </div>
    <div class="text-muted" style="font-size: 12.5px; font-weight: 600; margin-top: 3px">
      {{ props.cls.day }} · {{ props.cls.time }} · {{ branchShort(props.cls.branchId) }}
    </div>

    <div
      class="flex items-center justify-between"
      :style="{
        marginTop: '16px',
        paddingTop: '14px',
        borderTop: '1px solid var(--color-divider)',
      }"
    >
      <span class="text-muted" style="font-size: 12px; font-weight: 600">Average attendance</span>
      <span class="font-display font-bold" style="font-size: 15px; color: var(--color-fg-green)">
        {{ props.cls.attendPct }}%
      </span>
    </div>
  </NuxtLink>
</template>
