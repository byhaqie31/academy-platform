<script setup lang="ts">
import { computed } from 'vue'
import { formatRM } from '~/utils/money'
import type { CycleState } from '~/composables/usePortalDemo'
import type { PillTone } from '~/utils/status'

const props = defineProps<{
  cycle: CycleState
  period: string
  dueLabel: string
  paidOn: string
  total: number
  outstanding: number
  daysLeft: number
}>()

/** five states, not two */
const view = computed((): { key: string, tone: PillTone, icon: string, title: string } => {
  switch (props.cycle) {
    case 'paid':
      return { key: 'paid', tone: 'green', icon: 'i-fluent-checkmark-circle-20-regular', title: `Yuran ${props.period} sudah dijelaskan` }
    case 'partial':
      return { key: 'partial', tone: 'amber', icon: 'i-fluent-warning-20-regular', title: 'Sebahagian yuran belum dijelaskan' }
    case 'final':
      return { key: 'final', tone: 'overdue', icon: 'i-fluent-clock-alarm-20-regular', title: 'Hari terakhir untuk bayar' }
    case 'grace':
      return { key: 'grace', tone: 'amber', icon: 'i-fluent-clock-20-regular', title: 'Akses akan disekat esok' }
    case 'suspended':
      return { key: 'suspended', tone: 'overdue', icon: 'i-fluent-lock-closed-20-regular', title: 'Kelas disekat' }
    default:
      return { key: 'due', tone: 'violet', icon: 'i-fluent-payment-20-regular', title: `Yuran ${props.period}` }
  }
})

const countdown = computed(() => {
  if (props.daysLeft > 0) return `${props.daysLeft} hari lagi`
  if (props.daysLeft === 0) return 'Hari ini'
  return ''
})
</script>

<template>
  <section
    class="bg-surface"
    :style="{
      border: '1px solid var(--color-border-marketing)',
      borderRadius: '24px',
      padding: '18px',
      boxShadow: '0 10px 28px rgba(30,35,72,.06)',
    }"
  >
    <div class="flex items-start justify-between gap-3" :style="{ marginBottom: '14px' }">
      <div class="flex items-center gap-2.5 min-w-0">
        <IconTile :icon="view.icon" :tone="view.tone" :size="38" />
        <div class="min-w-0">
          <div class="font-display font-semibold text-ink" :style="{ fontSize: '15.5px', lineHeight: '1.25' }">
            {{ view.title }}
          </div>
          <div class="text-muted" :style="{ fontSize: '12.5px', marginTop: '2px' }">
            Tarikh akhir {{ dueLabel }}
          </div>
        </div>
      </div>
      <StatusPill v-if="countdown && view.key !== 'paid'" :tone="view.tone" :label="countdown" />
    </div>

    <div
      v-if="view.key !== 'paid'"
      class="flex items-end justify-between gap-3"
      :style="{
        background: 'var(--color-surface-lavender)',
        borderRadius: '16px',
        padding: '13px 15px',
        marginBottom: '13px',
      }"
    >
      <div>
        <div class="font-bold uppercase text-muted" :style="{ fontSize: '10.5px', letterSpacing: '0.05em' }">
          Perlu dibayar
        </div>
        <div class="font-display font-bold text-ink" :style="{ fontSize: '26px', lineHeight: '1.15', marginTop: '2px' }">
          {{ formatRM(outstanding) }}
        </div>
      </div>
      <div class="text-right text-muted" :style="{ fontSize: '12px' }">
        Jumlah bulan ini<br>
        <span class="font-semibold text-ink-soft">{{ formatRM(total) }}</span>
      </div>
    </div>

    <AppButton v-if="view.key !== 'paid'" to="/portal/parent/suspended" variant="green" block>
      Bayar sekarang
    </AppButton>

    <div
      v-else
      class="flex items-center justify-between gap-3"
      :style="{
        background: 'var(--color-tile-green)',
        borderRadius: '14px',
        padding: '12px 15px',
      }"
    >
      <span class="font-semibold" :style="{ color: 'var(--color-fg-green)', fontSize: '13.5px' }">
        {{ formatRM(total) }} diterima · {{ paidOn }}
      </span>
      <span class="font-bold" :style="{ color: 'var(--color-fg-green)', fontSize: '12.5px' }">Resit</span>
    </div>
  </section>
</template>
