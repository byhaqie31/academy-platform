<script setup lang="ts">
import type { ScheduleRow } from '~/composables/useSchedule'
import SubjectChip from '~/components/ui/SubjectChip.vue'
import { toneTile, toneFg } from '~/utils/tone'

defineProps<{ rows: ScheduleRow[]; days: string[] }>()
</script>

<template>
  <div class="hz-scroll">
    <div
      :style="{
        minWidth: '820px',
        display: 'grid',
        gridTemplateColumns: '64px repeat(6, 1fr)',
        gap: '8px',
      }"
    >
      <!-- Header row: empty corner + 6 day names -->
      <div />
      <div
        v-for="day in days"
        :key="day"
        class="font-bold text-muted uppercase text-center"
        :style="{ fontSize: '11px', letterSpacing: '0.04em', paddingBottom: '4px' }"
      >
        {{ day }}
      </div>

      <!-- One block per time row: time label (64px) then 6 day cells -->
      <template v-for="(row, ri) in rows" :key="ri">
        <div
          class="font-display font-bold text-ink grid place-items-center text-center"
          :style="{ fontSize: '12px', lineHeight: '1.2' }"
        >
          {{ row.time }}
        </div>

        <template v-for="(cell, ci) in row.cells" :key="ci">
          <!-- Empty slot -->
          <div
            v-if="!cell"
            :style="{
              background: 'var(--color-surface-subtle)',
              borderRadius: '12px',
              minHeight: '74px',
            }"
          />
          <!-- Filled slot: clickable, links to class attendance -->
          <NuxtLink
            v-else
            :to="'/tutor/kelas/' + cell.classId"
            class="tutor-cell block no-underline"
            :style="{
              background: toneTile(cell.tone),
              borderLeft: '3px solid ' + toneFg(cell.tone),
              borderRadius: '12px',
              padding: '9px',
              minHeight: '74px',
            }"
          >
            <SubjectChip :subject="cell.subject" size="sm" />
            <div class="font-bold text-ink" :style="{ fontSize: '12px', marginTop: '5px', lineHeight: '1.25' }">
              {{ cell.cls }}
            </div>
            <div class="text-muted" :style="{ fontSize: '11px', marginTop: '2px', lineHeight: '1.3' }">
              {{ cell.branch }}
            </div>
          </NuxtLink>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.tutor-cell {
  transition: transform 0.12s ease;
}
.tutor-cell:hover {
  transform: translateY(-1px);
}
.tutor-cell:focus-visible {
  outline: 2px solid var(--color-brand);
  outline-offset: 2px;
}
</style>
