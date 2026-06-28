<script setup lang="ts">
import { ref } from 'vue'
import { useSchedule } from '~/composables/useSchedule'
import { toneFg } from '~/utils/tone'
import AppButton from '~/components/ui/AppButton.vue'
import ScheduleGrid from '~/components/admin/ScheduleGrid.vue'
import LessonPlanCards from '~/components/admin/LessonPlanCards.vue'
import AssignClassModal from '~/components/admin/AssignClassModal.vue'

definePageMeta({ layout: 'admin' })

const schedule = useSchedule()
// Admin grid uses the fixed admin rows (3:00 / 4:30 / 6:00 / 7:30 PM).
const rows = schedule.grid()
const days = schedule.days
const legend = schedule.subjectLegend

const modalOpen = ref(false)
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h1 class="font-display font-bold text-ink" :style="{ fontSize: '30px', lineHeight: '1.1' }">
          Schedule
        </h1>
        <p class="text-muted" :style="{ fontSize: '14px', marginTop: '4px' }">Jadual</p>
      </div>
      <AppButton variant="dark" @click="modalOpen = true">+ Tetapkan kelas</AppButton>
    </header>

    <!-- Subject legend -->
    <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
      <div v-for="item in legend" :key="item.name" class="flex items-center gap-2">
        <span
          :style="{
            width: '12px',
            height: '12px',
            borderRadius: '4px',
            background: toneFg(item.tone),
          }"
        />
        <span class="font-bold text-ink-soft" :style="{ fontSize: '12.5px' }">{{ item.name }}</span>
      </div>
    </div>

    <!-- Weekly grid -->
    <section
      class="bg-surface"
      :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '20px' }"
    >
      <ScheduleGrid :rows="rows" :days="days" />
    </section>

    <!-- Lesson plans -->
    <LessonPlanCards />

    <!-- Assign-class modal -->
    <AssignClassModal :open="modalOpen" @close="modalOpen = false" />
  </div>
</template>
