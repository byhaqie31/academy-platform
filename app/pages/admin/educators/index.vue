<script setup lang="ts">
import DataTable, { type Column } from '~/components/ui/DataTable.vue'
import IconTile from '~/components/ui/IconTile.vue'
import SubjectChip from '~/components/ui/SubjectChip.vue'
import { useEducators } from '~/composables/useEducators'
import { useClasses } from '~/composables/useClasses'
import { formatRM } from '~/utils/money'

definePageMeta({ layout: 'admin' })

const { all, estimatedPay } = useEducators()
const classes = useClasses()
const classCount = (educatorId: string) => classes.forEducator(educatorId).length

const columns: Column[] = [
  { key: 'name', label: 'Educator' },
  { key: 'subjects', label: 'Subject' },
  { key: 'classes', label: 'Classes' },
  { key: 'rate', label: 'Hourly rate', align: 'right' },
  { key: 'hours', label: 'Hours this month', align: 'right' },
  { key: 'pay', label: 'Est. salary', align: 'right' },
]

function open(id: string) {
  navigateTo('/admin/educators/' + id)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h1 class="font-display font-bold text-ink" style="font-size: 30px; line-height: 1.1">
          Educators
        </h1>
        <p class="text-muted mt-1" style="font-size: 14px">
          {{ all.length }} active educators, teaching online
        </p>
      </div>
    </header>

    <DataTable :columns="columns" :rows="all" row-key="id" @row-click="open($event.id)">
      <template #cell-name="{ row }">
        <div class="flex items-center gap-3">
          <IconTile :icon="row.first.charAt(0)" :tone="row.tone" :size="38" :radius="11" />
          <span class="font-bold text-ink" style="font-size: 13.5px">{{ row.name }}</span>
        </div>
      </template>

      <template #cell-subjects="{ row }">
        <div class="flex flex-wrap" style="gap: 4px">
          <SubjectChip v-for="s in row.subjects" :key="s" :subject="s" size="sm" />
        </div>
      </template>

      <template #cell-classes="{ row }">
        <span class="text-ink-soft" style="font-size: 12.5px">
          {{ classCount(row.id) }} {{ classCount(row.id) === 1 ? 'class' : 'classes' }}
        </span>
      </template>

      <template #cell-rate="{ row }">
        <span class="font-bold text-ink" style="font-size: 13px">{{ formatRM(row.rate) }} / h</span>
      </template>

      <template #cell-hours="{ row }">
        <span class="font-bold" style="font-size: 13px; color: #3a3f5c">{{ row.hours }} h</span>
      </template>

      <template #cell-pay="{ row }">
        <span class="font-display font-bold" style="font-size: 15px; color: var(--color-fg-green)">
          {{ formatRM(estimatedPay(row.id)) }}
        </span>
      </template>
    </DataTable>
  </div>
</template>
