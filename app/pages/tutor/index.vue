<script setup lang="ts">
import { computed } from 'vue'
import StatCard from '~/components/ui/StatCard.vue'
import AppButton from '~/components/ui/AppButton.vue'
import TodayClasses from '~/components/tutor/TodayClasses.vue'
import EarningsMini from '~/components/tutor/EarningsMini.vue'
import PlansThisWeek from '~/components/tutor/PlansThisWeek.vue'
import { useEducators } from '~/composables/useEducators'
import { useClasses } from '~/composables/useClasses'
import { useGreeting } from '~/composables/useGreeting'
import { formatRM } from '~/utils/money'

definePageMeta({ layout: 'tutor' })

const { greeting, dateLabel } = useGreeting()
const { self, estimatedPay } = useEducators()
const me = self()
const myClasses = useClasses().forEducator(me.id)

// Derived, never hand-entered: today is Mon in this curated snapshot.
const todayCount = computed(() => myClasses.filter((c) => c.day === 'Mon').length)
const studentCount = computed(() => myClasses.reduce((t, c) => t + c.roster.length, 0))
const weekHours = computed(() => myClasses.reduce((t, c) => t + c.dur, 0))

const stats = computed(() => [
  { icon: '📚', tone: 'pink' as const, value: String(todayCount.value), label: 'Classes today', delta: 'Mon' },
  { icon: '⏱️', tone: 'blue' as const, value: `${weekHours.value} h`, label: 'Hours this week', delta: '4 classes' },
  { icon: '🧑‍🎓', tone: 'violet' as const, value: String(studentCount.value), label: 'My students', delta: 'active' },
  { icon: '💰', tone: 'green' as const, value: formatRM(estimatedPay('hafiz')), label: 'Est. salary', sub: 'Estimated salary, June', delta: '38 h' },
])
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h1 class="font-display font-bold text-ink" style="font-size: 30px; line-height: 1.1">
          {{ greeting }}, Cikgu Hafiz 👋
        </h1>
        <p class="text-muted mt-1" style="font-size: 14px">{{ dateLabel }} · {{ todayCount }} classes today</p>
      </div>
      <AppButton variant="dark" to="/tutor/earnings">View my earnings →</AppButton>
    </header>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard v-for="s in stats" :key="s.label" v-bind="s" />
    </div>

    <div class="grid gap-5 lg:grid-cols-[1.05fr_1fr] items-start">
      <TodayClasses />
      <div class="flex flex-col gap-5">
        <EarningsMini />
        <PlansThisWeek />
      </div>
    </div>
  </div>
</template>
