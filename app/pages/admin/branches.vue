<script setup lang="ts">
import StubScreen from '~/components/admin/StubScreen.vue'
import { useAdminMetrics } from '~/composables/useAdminMetrics'

definePageMeta({ layout: 'admin' })
const m = useAdminMetrics()
const stats = [
  { icon: 'i-fluent-location-24-regular', tone: 'pink' as const, value: String(m.branchesActive), label: 'Active branches', sub: 'Selangor and Pahang' },
  { icon: 'i-fluent-hat-graduation-24-regular', tone: 'blue' as const, value: String(m.activeStudents), label: 'Total students', sub: 'All branches' },
  { icon: 'i-fluent-book-24-regular', tone: 'violet' as const, value: String(m.classesActive), label: 'Active classes', sub: 'This week' },
]
</script>

<template>
  <StubScreen
    title="Branches"
    icon="i-fluent-location-24-regular"
    desc="Full details for each branch, student and tutor counts, and performance per location will live here."
    :stats="stats"
  />
</template>
