<script setup lang="ts">
import IconTile from '~/components/ui/IconTile.vue'
import { useClasses } from '~/composables/useClasses'
import { useAcademy } from '~/composables/useAcademy'
import { useSubjects } from '~/composables/useSubjects'
import { formatRM } from '~/utils/money'

defineProps<{ rows: { classId: string; hours: number; amount: number }[] }>()

const { byId } = useClasses()
const { branchShort } = useAcademy()
const { byName } = useSubjects()
</script>

<template>
  <div
    class="bg-surface"
    :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '22px' }"
  >
    <div class="font-display font-semibold text-ink" style="font-size: 17px; margin-bottom: 16px">
      Jam mengikut kelas
    </div>

    <div class="flex flex-col" style="gap: 14px">
      <div
        v-for="row in rows"
        :key="row.classId"
        class="flex items-center"
        style="gap: 12px"
      >
        <IconTile
          :icon="byName(byId(row.classId)?.subject ?? '')?.icon ?? '📐'"
          :tone="byName(byId(row.classId)?.subject ?? '')?.tone ?? 'pink'"
          :size="40"
        />
        <div class="min-w-0" style="flex: 1">
          <div class="text-ink truncate" style="font-size: 13.5px; font-weight: 700">
            {{ byId(row.classId)?.cls }} · {{ branchShort(byId(row.classId)?.branchId ?? '') }}
          </div>
          <div class="text-muted" style="font-size: 12px; font-weight: 600; margin-top: 2px">
            {{ row.hours }} j
          </div>
        </div>
        <span class="font-display font-bold shrink-0" :style="{ fontSize: '15px', color: 'var(--color-fg-green)' }">
          {{ formatRM(row.amount) }}
        </span>
      </div>
    </div>
  </div>
</template>
