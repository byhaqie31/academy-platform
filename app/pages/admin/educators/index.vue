<script setup lang="ts">
import DataTable, { type Column } from '~/components/ui/DataTable.vue'
import IconTile from '~/components/ui/IconTile.vue'
import SubjectChip from '~/components/ui/SubjectChip.vue'
import { useEducators } from '~/composables/useEducators'
import { useAcademy } from '~/composables/useAcademy'
import { formatRM } from '~/utils/money'

definePageMeta({ layout: 'admin' })

const { all, estimatedPay } = useEducators()
const { academy } = useAcademy()

const columns: Column[] = [
  { key: 'name', label: 'Pendidik' },
  { key: 'subjects', label: 'Subjek' },
  { key: 'branches', label: 'Cawangan' },
  { key: 'rate', label: 'Kadar per jam', align: 'right' },
  { key: 'hours', label: 'Jam bln ini', align: 'right' },
  { key: 'pay', label: 'Anggaran gaji', align: 'right' },
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
          Educators <span class="text-muted" style="font-weight: 600">/ Pendidik</span>
        </h1>
        <p class="text-muted mt-1" style="font-size: 14px">
          {{ all.length }} pendidik aktif merentas cawangan {{ academy.name }}
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

      <template #cell-branches="{ row }">
        <span class="text-ink-soft" style="font-size: 12.5px">{{ row.branches }}</span>
      </template>

      <template #cell-rate="{ row }">
        <span class="font-bold text-ink" style="font-size: 13px">{{ formatRM(row.rate) }} / j</span>
      </template>

      <template #cell-hours="{ row }">
        <span class="font-bold" style="font-size: 13px; color: #3a3f5c">{{ row.hours }} j</span>
      </template>

      <template #cell-pay="{ row }">
        <span class="font-display font-bold" style="font-size: 15px; color: var(--color-fg-green)">
          {{ formatRM(estimatedPay(row.id)) }}
        </span>
      </template>
    </DataTable>
  </div>
</template>
