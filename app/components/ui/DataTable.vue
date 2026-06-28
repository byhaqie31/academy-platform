<script setup lang="ts" generic="T extends Record<string, any>">
export interface Column {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
}

defineProps<{ columns: Column[]; rows: T[]; rowKey?: string; minWidth?: number }>()
defineEmits<{ rowClick: [row: T] }>()
defineSlots<{
  [key: `cell-${string}`]: (props: { row: T }) => any
}>()
</script>

<template>
  <div
    class="bg-surface hz-scroll"
    :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', overflow: 'hidden' }"
  >
    <table class="w-full border-collapse" :style="{ minWidth: (minWidth ?? 880) + 'px' }">
      <thead>
        <tr :style="{ background: 'var(--color-surface-subtle)' }">
          <th
            v-for="col in columns"
            :key="col.key"
            class="uppercase font-extrabold text-faint"
            :style="{
              padding: '14px 16px',
              fontSize: '11px',
              letterSpacing: '0.04em',
              textAlign: col.align ?? 'left',
            }"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, i) in rows"
          :key="rowKey ? row[rowKey] : i"
          class="cursor-pointer transition-colors hover:bg-[var(--color-surface-subtle)]"
          :style="{ borderTop: '1px solid var(--color-divider)' }"
          @click="$emit('rowClick', row)"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="text-text-body"
            :style="{ padding: '14px 16px', fontSize: '13px', textAlign: col.align ?? 'left' }"
          >
            <slot :name="`cell-${col.key}`" :row="row">{{ row[col.key] }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
