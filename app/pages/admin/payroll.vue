<script setup lang="ts">
import StubScreen from '~/components/admin/StubScreen.vue'
import { useAdminMetrics } from '~/composables/useAdminMetrics'
import { formatRM } from '~/utils/money'

definePageMeta({ layout: 'admin' })
const m = useAdminMetrics()
const stats = [
  { icon: '💰', tone: 'green' as const, value: formatRM(m.payrollTotal), label: 'Jumlah gaji Jun', sub: 'Semua tutor' },
  { icon: '🧑‍🏫', tone: 'blue' as const, value: '6', label: 'Tutor aktif', sub: 'Bulan ini' },
  { icon: '⏱️', tone: 'violet' as const, value: `${m.totalHours} j`, label: 'Jam direkod', sub: 'Jun 2026' },
]
</script>

<template>
  <StubScreen
    title="Payroll"
    malay="Gaji tutor"
    icon="💰"
    desc="Senarai gaji untuk semua tutor, slip gaji boleh muat turun, dan potongan akan disediakan di sini. Setiap angka dikira dari jam mengajar yang direkod."
    :stats="stats"
  />
</template>
