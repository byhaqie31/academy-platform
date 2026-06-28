<script setup lang="ts">
import { computed } from 'vue'
import { useBilling } from '~/composables/useBilling'
import { useAcademy } from '~/composables/useAcademy'
import StatusPill from '~/components/ui/StatusPill.vue'
import IconTile from '~/components/ui/IconTile.vue'
import { formatRM } from '~/utils/money'
import { payTone } from '~/utils/status'
import { toneByIndex } from '~/utils/tone'

const billing = useBilling()
const { branchShort } = useAcademy()

// Overdue first, then pending; the three most pressing.
const rows = computed(() =>
  [...billing.all]
    .filter((i) => i.status !== 'Paid')
    .sort((a, b) => (a.status === 'Overdue' ? -1 : 1) - (b.status === 'Overdue' ? -1 : 1))
    .slice(0, 3),
)
const note = (status: string, branchId: string) =>
  status === 'Overdue'
    ? `Tertunggak sejak 15 Jun · ${branchShort(branchId)}`
    : `Belum ada bukti · ${branchShort(branchId)}`
</script>

<template>
  <section
    class="bg-surface"
    :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '20px' }"
  >
    <div class="flex items-center justify-between mb-3">
      <h2 class="font-display font-semibold text-ink" style="font-size: 16px">Bayaran tertunggak</h2>
      <NuxtLink to="/admin/billing" class="no-underline font-bold text-brand-deep" style="font-size: 12.5px">
        Lihat semua →
      </NuxtLink>
    </div>

    <ul class="flex flex-col gap-2.5">
      <li v-for="(o, i) in rows" :key="o.id" class="flex items-center gap-3">
        <IconTile :icon="o.name.charAt(0)" :tone="toneByIndex(i)" :size="36" :radius="11" />
        <div class="min-w-0 flex-1">
          <div class="font-bold text-ink" style="font-size: 13px">{{ o.name }}</div>
          <div class="text-faint truncate" style="font-size: 11px; font-weight: 600">{{ note(o.status, o.branchId) }}</div>
        </div>
        <div class="flex flex-col items-end gap-1 shrink-0">
          <span class="font-display font-bold text-ink" style="font-size: 14px">{{ formatRM(o.amount) }}</span>
          <StatusPill :tone="payTone(o.status)" :label="o.status" />
        </div>
      </li>
    </ul>
  </section>
</template>
