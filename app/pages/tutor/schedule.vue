<script setup lang="ts">
import { useEducators } from '~/composables/useEducators'
import { useSchedule } from '~/composables/useSchedule'
import TutorScheduleGrid from '~/components/tutor/TutorScheduleGrid.vue'

definePageMeta({ layout: 'tutor' })

const self = useEducators().self()
const schedule = useSchedule()
</script>

<template>
  <div class="flex flex-col gap-6">
    <header>
      <h1 class="font-display font-bold text-ink" :style="{ fontSize: '30px', lineHeight: '1.1' }">
        My schedule
      </h1>
    </header>

    <!-- Weekly grid -->
    <section
      class="bg-surface"
      :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '20px' }"
    >
      <TutorScheduleGrid
        :rows="schedule.grid({ educatorId: self.id })"
        :days="schedule.days"
      />
    </section>

    <p class="text-muted" :style="{ fontSize: '13px' }">
      Click any class to mark attendance.
    </p>
  </div>
</template>
