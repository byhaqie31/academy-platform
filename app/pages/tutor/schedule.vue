<script setup lang="ts">
import { useEducators } from '~/composables/useEducators'
import { useSchedule } from '~/composables/useSchedule'
import TutorScheduleGrid from '~/components/tutor/TutorScheduleGrid.vue'

definePageMeta({ layout: 'tutor' })

const self = useEducators().self()
const schedule = useSchedule()

// Branch legend swatches mirror the centre palette: brand for Kota Warisan,
// accent pink for Kajang.
const branchLegend = [
  { name: 'Kota Warisan', color: 'var(--color-brand)' },
  { name: 'Kajang', color: 'var(--color-accent-pink)' },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <header>
      <h1 class="font-display font-bold text-ink" :style="{ fontSize: '30px', lineHeight: '1.1' }">
        My schedule
      </h1>
    </header>

    <!-- Branch legend -->
    <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
      <div v-for="b in branchLegend" :key="b.name" class="flex items-center gap-2">
        <span
          :style="{
            width: '11px',
            height: '11px',
            borderRadius: '999px',
            background: b.color,
          }"
        />
        <span class="font-bold text-ink-soft" :style="{ fontSize: '12.5px' }">{{ b.name }}</span>
      </div>
    </div>

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
