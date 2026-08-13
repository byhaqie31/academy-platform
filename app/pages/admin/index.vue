<script setup lang="ts">
import { computed, ref } from 'vue'
import StatCard from '~/components/ui/StatCard.vue'
import RegisterStudentModal from '~/components/admin/RegisterStudentModal.vue'
import TonightStrip from '~/components/admin/TonightStrip.vue'
import CollectionCycleCard from '~/components/admin/CollectionCycleCard.vue'
import AppButton from '~/components/ui/AppButton.vue'
import RevenueHero from '~/components/admin/RevenueHero.vue'
import ScheduleToday from '~/components/admin/ScheduleToday.vue'
import EnquiryList from '~/components/admin/EnquiryList.vue'
import OutstandingList from '~/components/admin/OutstandingList.vue'
import { useAdminMetrics } from '~/composables/useAdminMetrics'
import { useDemoActions } from '~/composables/useDemoActions'
import { useGreeting } from '~/composables/useGreeting'
import type { NewStudent } from '~/types'
import { formatRM } from '~/utils/money'

definePageMeta({ layout: 'admin' })

const { greeting, dateLabel } = useGreeting()
const m = useAdminMetrics()
const demo = useDemoActions()
const toast = useToast()

const registerOpen = ref(false)

function onRegister(student: NewStudent) {
  demo.registerStudent(student)
  registerOpen.value = false
  toast.add({
    title: `${student.name} registered`,
    description: `${student.level} · ${student.subjects.join(', ')}. They are on the roll now.`,
    icon: 'i-fluent-person-add-24-regular',
    color: 'success',
  })
}
// Computed, not read once: recording a payment has to move the outstanding tile.
const stats = computed(() => [
  { icon: 'i-fluent-sparkle-24-regular', tone: 'pink' as const, value: String(m.enquiries), label: 'New enquiries', delta: '+5 today' },
  { icon: 'i-fluent-hat-graduation-24-regular', tone: 'blue' as const, value: String(m.activeStudents), label: 'Active students', delta: '+12 this month' },
  { icon: 'i-fluent-book-24-regular', tone: 'violet' as const, value: String(m.classesToday), label: 'Classes today', delta: '3 upcoming' },
  { icon: 'i-fluent-payment-24-regular', tone: 'amber' as const, value: formatRM(m.outstanding), label: 'Outstanding', delta: `${m.outstandingCount} students` },
])
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
      <AppButton variant="dark" @click="registerOpen = true">+ Register new student</AppButton>
    </header>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard v-for="s in stats" :key="s.label" v-bind="s" />
    </div>

    <!-- The two things an owner checks first: is tonight running, and is the
         money in. Both link through to the screen that acts on them. -->
    <div class="grid gap-5 lg:grid-cols-2 items-start">
      <TonightStrip />
      <CollectionCycleCard />
    </div>

    <RevenueHero />

    <div class="grid gap-5 lg:grid-cols-[1.05fr_1fr] items-start">
      <ScheduleToday />
      <div class="flex flex-col gap-5">
        <EnquiryList />
        <OutstandingList />
      </div>
    </div>

    <RegisterStudentModal
      :open="registerOpen"
      @close="registerOpen = false"
      @submit="onRegister"
    />
  </div>
</template>
