<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBilling, type BillingFilter } from '~/composables/useBilling'
import { useAcademy } from '~/composables/useAcademy'
import StatusPill from '~/components/ui/StatusPill.vue'
import IconTile from '~/components/ui/IconTile.vue'
import DataTable, { type Column } from '~/components/ui/DataTable.vue'
import ProofThumb from '~/components/admin/ProofThumb.vue'
import { formatRM } from '~/utils/money'
import { payTone } from '~/utils/status'
import { toneByIndex } from '~/utils/tone'

definePageMeta({ layout: 'admin' })

const billing = useBilling()
const { branchShort } = useAcademy()

const summary = billing.summary()
const paidCount = computed(() => billing.filter('paid').length)
const pendingCount = computed(() => billing.filter('pending').length)
const overdueCount = computed(() => billing.filter('overdue').length)

// Custom-coloured summary cards in the StatCard mould.
const cards = computed(() => [
  {
    icon: 'i-fluent-checkmark-circle-24-regular',
    tone: 'green' as const,
    label: 'Paid',
    value: formatRM(summary.paid),
    valueColor: 'var(--color-fg-green)',
    sub: `${paidCount.value} invoices settled`,
  },
  {
    icon: 'i-fluent-hourglass-24-regular',
    tone: 'amber' as const,
    label: 'Pending',
    value: formatRM(summary.pending),
    valueColor: 'var(--color-fg-amber)',
    sub: `${pendingCount.value} awaiting proof`,
  },
  {
    icon: 'i-fluent-warning-24-regular',
    tone: 'overdue' as const,
    label: 'Overdue',
    value: formatRM(summary.overdue),
    valueColor: 'var(--color-fg-overdue)',
    sub: `${overdueCount.value} overdue`,
  },
])

const tabs: { key: BillingFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'paid', label: 'Paid' },
  { key: 'pending', label: 'Pending' },
  { key: 'overdue', label: 'Overdue' },
]
const active = ref<BillingFilter>('all')
const rows = computed(() => billing.filter(active.value))

const columns: Column[] = [
  { key: 'student', label: 'Student' },
  { key: 'period', label: 'Period' },
  { key: 'amount', label: 'Amount', align: 'right' },
  { key: 'proof', label: 'Proof of payment' },
  { key: 'status', label: 'Status' },
  { key: 'action', label: 'Action', align: 'right' },
]
</script>

<template>
  <div class="flex flex-col gap-5">
    <header>
      <h1 class="font-display font-bold text-ink" style="font-size: 28px; line-height: 1.1">
        Billing
      </h1>
      <p class="text-muted mt-1" style="font-size: 13.5px; font-weight: 600">
        Student subscriptions and invoices · manual proof-of-payment review
      </p>
    </header>

    <div class="grid gap-4 sm:grid-cols-3">
      <div
        v-for="c in cards"
        :key="c.label"
        class="bg-surface p-[18px]"
        :style="{ border: '1px solid var(--color-border)', borderRadius: '18px' }"
      >
        <div class="flex items-center gap-2.5">
          <IconTile :icon="c.icon" :tone="c.tone" :size="38" :radius="11" />
          <span class="font-bold text-muted" style="font-size: 12.5px">{{ c.label }}</span>
        </div>
        <div
          class="mt-3 font-display font-bold"
          :style="{ fontSize: '28px', lineHeight: '1.1', color: c.valueColor }"
        >
          {{ c.value }}
        </div>
        <div class="text-faint mt-1" style="font-size: 11.5px; font-weight: 600">{{ c.sub }}</div>
      </div>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="t in tabs"
        :key="t.key"
        type="button"
        class="cursor-pointer font-bold transition-colors"
        :style="{
          padding: '9px 16px',
          borderRadius: '999px',
          fontSize: '12.5px',
          border: 'none',
          background: active === t.key ? 'var(--color-ink)' : 'var(--color-tile-inactive)',
          color: active === t.key ? '#fff' : 'var(--color-ink-soft)',
        }"
        @click="active = t.key"
      >
        {{ t.label }}
      </button>
    </div>

    <DataTable :columns="columns" :rows="rows" row-key="id">
      <template #cell-student="{ row }">
        <div class="flex items-center gap-2.5">
          <IconTile
            :icon="row.name.charAt(0)"
            :tone="toneByIndex(rows.indexOf(row))"
            :size="34"
            :radius="10"
          />
          <div class="min-w-0">
            <div class="font-bold text-ink" style="font-size: 13px">{{ row.name }}</div>
            <div class="text-muted" style="font-size: 10.5px; font-weight: 600">
              {{ branchShort(row.branchId) }}
            </div>
          </div>
        </div>
      </template>

      <template #cell-period="{ row }">
        <span class="text-text-body" style="font-size: 12.5px; font-weight: 600">{{ row.period }}</span>
      </template>

      <template #cell-amount="{ row }">
        <span class="font-display font-bold text-ink" style="font-size: 13.5px">{{ formatRM(row.amount) }}</span>
      </template>

      <template #cell-proof="{ row }">
        <ProofThumb v-if="row.proof" />
        <span v-else class="text-faint" style="font-size: 11.5px; font-weight: 700">— None yet</span>
      </template>

      <template #cell-status="{ row }">
        <StatusPill :tone="payTone(row.status)" :label="row.status" />
      </template>

      <template #cell-action="{ row }">
        <button
          v-if="row.status !== 'Paid'"
          type="button"
          class="cursor-pointer font-bold text-white"
          :style="{
            border: 'none',
            background: 'var(--green-gradient)',
            padding: '7px 13px',
            borderRadius: '10px',
            fontSize: '11.5px',
            boxShadow: 'var(--shadow-wa)',
          }"
        >
          ✓ Mark as paid
        </button>
        <button
          v-else
          type="button"
          class="cursor-pointer font-bold text-muted"
          :style="{
            background: '#fff',
            border: '1px solid var(--color-border)',
            padding: '7px 13px',
            borderRadius: '10px',
            fontSize: '11.5px',
          }"
        >
          View receipt
        </button>
      </template>
    </DataTable>
  </div>
</template>
