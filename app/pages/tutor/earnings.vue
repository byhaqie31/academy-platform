<script setup lang="ts">
import AppButton from '~/components/ui/AppButton.vue'
import EarningsHero from '~/components/tutor/EarningsHero.vue'
import WeeklyHoursBars from '~/components/tutor/WeeklyHoursBars.vue'
import HoursByClass from '~/components/tutor/HoursByClass.vue'
import { useEducators } from '~/composables/useEducators'
import { usePayroll } from '~/composables/usePayroll'

definePageMeta({ layout: 'tutor' })

const self = useEducators().self()
const payroll = usePayroll()

// All money is derived in usePayroll, never hand-entered. runFor sums the
// tutor's recorded sessions × rate, reconciling with the per-class breakdown.
const run = payroll.runFor(self.id, 'Jun 2026')
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h1 class="font-display font-bold text-ink" :style="{ fontSize: '30px', lineHeight: '1.1' }">
          Pendapatan
        </h1>
        <p class="text-muted" :style="{ fontSize: '14px', marginTop: '4px' }">My earnings</p>
      </div>
      <AppButton variant="outline">⬇ Muat turun slip</AppButton>
    </header>

    <EarningsHero :hours="run.hours" :rate="run.rate" :amount="run.amount" />

    <div class="grid gap-5 lg:grid-cols-2 items-start">
      <WeeklyHoursBars
        :weeks="payroll.weeklyBreakdown(self.id)"
        :labels="payroll.weekLabels"
      />
      <HoursByClass :rows="payroll.byClass(self.id)" />
    </div>
  </div>
</template>
