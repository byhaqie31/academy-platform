<script setup lang="ts">
import StubScreen from '~/components/admin/StubScreen.vue'
import { useAdminMetrics } from '~/composables/useAdminMetrics'

definePageMeta({ layout: 'admin' })
const m = useAdminMetrics()
const stats = [
  { icon: '📍', tone: 'pink' as const, value: String(m.branchesActive), label: 'Cawangan aktif', sub: 'Selangor & Pahang' },
  { icon: '🧑‍🎓', tone: 'blue' as const, value: String(m.activeStudents), label: 'Jumlah pelajar', sub: 'Semua cawangan' },
  { icon: '📚', tone: 'violet' as const, value: String(m.classesActive), label: 'Kelas aktif', sub: 'Minggu ini' },
]
</script>

<template>
  <StubScreen
    title="Branches"
    malay="Cawangan"
    icon="📍"
    desc="Maklumat penuh setiap cawangan, bilangan pelajar, tutor, dan prestasi setiap lokasi akan dipaparkan di sini."
    :stats="stats"
  />
</template>
