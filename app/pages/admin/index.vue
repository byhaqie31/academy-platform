<script setup lang="ts">
import StatCard from '~/components/ui/StatCard.vue'
import AppButton from '~/components/ui/AppButton.vue'
import RevenueHero from '~/components/admin/RevenueHero.vue'
import ScheduleToday from '~/components/admin/ScheduleToday.vue'
import EnquiryList from '~/components/admin/EnquiryList.vue'
import OutstandingList from '~/components/admin/OutstandingList.vue'
import { useAdminMetrics } from '~/composables/useAdminMetrics'
import { useGreeting } from '~/composables/useGreeting'
import { formatRM } from '~/utils/money'

definePageMeta({ layout: 'admin' })

const { greeting, dateLabel } = useGreeting()
const m = useAdminMetrics()
const stats = [
  { icon: 'i-fluent-sparkle-24-regular', tone: 'pink' as const, value: String(m.enquiries), label: 'New enquiries', delta: '+5 today' },
  { icon: 'i-fluent-hat-graduation-24-regular', tone: 'blue' as const, value: String(m.activeStudents), label: 'Active students', delta: '+12 this month' },
  { icon: 'i-fluent-book-24-regular', tone: 'violet' as const, value: String(m.classesToday), label: 'Classes today', delta: '3 upcoming' },
  { icon: 'i-fluent-payment-24-regular', tone: 'amber' as const, value: formatRM(m.outstanding), label: 'Outstanding', delta: `${m.outstandingCount} students` },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h1 class="font-display font-bold text-ink" style="font-size: 30px; line-height: 1.1">
          {{ greeting }}, Admin 👋
        </h1>
        <p class="text-muted mt-1" style="font-size: 14px">{{ dateLabel }} · Today's operations summary</p>
      </div>
      <AppButton variant="dark">+ Register new student</AppButton>
    </header>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard v-for="s in stats" :key="s.label" v-bind="s" />
    </div>

    <RevenueHero />

    <div class="grid gap-5 lg:grid-cols-[1.05fr_1fr] items-start">
      <ScheduleToday />
      <div class="flex flex-col gap-5">
        <EnquiryList />
        <OutstandingList />
      </div>
    </div>
  </div>
</template>
