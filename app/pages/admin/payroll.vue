<script setup lang="ts">
import StubScreen from '~/components/admin/StubScreen.vue'
import { useAdminMetrics } from '~/composables/useAdminMetrics'
import { formatRM } from '~/utils/money'

definePageMeta({ layout: 'admin' })
const m = useAdminMetrics()
const stats = [
  { icon: '💰', tone: 'green' as const, value: formatRM(m.payrollTotal), label: 'June payroll total', sub: 'All tutors' },
  { icon: '🧑‍🏫', tone: 'blue' as const, value: '6', label: 'Active tutors', sub: 'This month' },
  { icon: '⏱️', tone: 'violet' as const, value: `${m.totalHours} h`, label: 'Hours logged', sub: 'Jun 2026' },
]
</script>

<template>
  <StubScreen
    title="Payroll"
    malay="Payroll"
    icon="💰"
    desc="Payroll for all tutors, downloadable payslips, and deductions will live here. Every figure is calculated from recorded teaching hours."
    :stats="stats"
  />
</template>
