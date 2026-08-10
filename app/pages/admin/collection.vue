<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCollection } from '~/composables/useCollection'
import DataTable, { type Column } from '~/components/ui/DataTable.vue'
import StatusPill from '~/components/ui/StatusPill.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { formatRM } from '~/utils/money'
import { payTone } from '~/utils/status'

definePageMeta({ layout: 'admin' })

const collection = useCollection()
const board = collection.board

type Tab = 'unpaid' | 'all'
const tab = ref<Tab>('unpaid')
const rows = computed(() => (tab.value === 'unpaid' ? collection.unpaid : collection.rows))

const tabs: { k: Tab, label: string }[] = [
  { k: 'unpaid', label: `Not yet paid (${collection.unpaid.length})` },
  { k: 'all', label: `All families (${collection.rows.length})` },
]

const columns: Column[] = [
  { key: 'guardian', label: 'Family' },
  { key: 'children', label: 'Children' },
  { key: 'branch', label: 'Branch' },
  { key: 'amount', label: 'Outstanding', align: 'right' },
  { key: 'lastReminder', label: 'Last chased' },
  { key: 'status', label: 'Status' },
]
</script>

<template>
  <div class="flex flex-col gap-5">
    <header class="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h1 class="font-display font-bold text-ink" style="font-size: 28px; line-height: 1.1">
          Collection week
        </h1>
        <p class="text-muted mt-1" style="font-size: 13.5px; font-weight: 600">
          {{ board.period }} · fees due on the 7th · access pauses on the 8th
        </p>
      </div>
      <AppButton variant="dark">Chase selected</AppButton>
    </header>

    <section
      :style="{
        background: 'var(--hero-dark-gradient)',
        borderRadius: '24px',
        padding: '22px',
        boxShadow: 'var(--shadow-revenue)',
      }"
    >
      <div class="flex items-center justify-between gap-4 flex-wrap" :style="{ marginBottom: '18px' }">
        <div>
          <div class="font-bold uppercase" :style="{ color: 'var(--color-footer-faint)', fontSize: '10.5px', letterSpacing: '0.08em' }">
            Today · {{ board.today }}
          </div>
          <div class="font-display font-bold" :style="{ color: '#fff', fontSize: '30px', lineHeight: '1.1', marginTop: '3px' }">
            {{ formatRM(board.outstanding) }} not in yet
          </div>
        </div>
        <div
          class="font-bold"
          :style="{
            background: 'rgba(255,255,255,.12)',
            color: '#fff',
            borderRadius: '999px',
            padding: '9px 16px',
            fontSize: '13px',
          }"
        >
          {{ board.daysLeft }} days left
        </div>
      </div>

      <div class="grid gap-3" style="grid-template-columns: repeat(auto-fit, minmax(140px, 1fr))">
        <div v-for="s in [
          { label: 'Families paid', value: board.familiesPaid, tone: 'var(--color-whatsapp-soft)' },
          { label: 'Not yet paid', value: board.familiesUnpaid, tone: 'var(--color-accent-orange)' },
          { label: 'Students suspend on the 8th', value: board.projectedSuspensions, tone: 'var(--color-accent-pink)' },
          { label: 'Families total', value: board.familiesTotal, tone: '#fff' },
        ]" :key="s.label" :style="{ background: 'rgba(255,255,255,.07)', borderRadius: '16px', padding: '13px 15px' }">
          <div class="font-display font-bold" :style="{ color: s.tone, fontSize: '23px', lineHeight: '1.1' }">
            {{ s.value }}
          </div>
          <div class="font-semibold" :style="{ color: 'var(--color-footer-muted)', fontSize: '11.5px', marginTop: '3px' }">
            {{ s.label }}
          </div>
        </div>
      </div>

      <p :style="{ color: 'var(--color-footer-text)', fontSize: '12.5px', margin: '16px 0 0', lineHeight: '1.5' }">
        At this rate, about {{ board.projectedSuspensions }} students lose access on the 8th.
        Seeing that on the 5th is what makes someone act on the 6th.
      </p>
    </section>

    <div class="flex gap-1.5">
      <button
        v-for="t in tabs"
        :key="t.k"
        type="button"
        class="font-semibold transition-colors"
        :style="{
          padding: '8px 15px',
          borderRadius: '999px',
          fontSize: '12.5px',
          background: tab === t.k ? 'var(--color-ink)' : 'var(--color-tile-inactive)',
          color: tab === t.k ? '#fff' : 'var(--color-ink-soft)',
        }"
        @click="tab = t.k"
      >
        {{ t.label }}
      </button>
    </div>

    <DataTable :columns="columns" :rows="rows" row-key="guardianId" :min-width="940">
      <template #cell-guardian="{ row }">
        <div class="font-semibold text-ink">{{ row.guardian }}</div>
        <div class="text-faint" :style="{ fontSize: '11.5px' }">
          {{ row.phone }}
          <span v-if="row.lapsedBefore" :style="{ color: 'var(--color-fg-overdue)' }"> · lapsed before</span>
        </div>
      </template>
      <template #cell-amount="{ row }">
        <span class="font-semibold text-ink">{{ formatRM(row.amount) }}</span>
      </template>
      <template #cell-status="{ row }">
        <StatusPill :tone="payTone(row.status)" :label="row.status === 'Paid' ? 'Paid' : row.status === 'Pending' ? 'Not yet' : 'Overdue'" />
      </template>
    </DataTable>
  </div>
</template>
