<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStudents, type StudentFilter } from '~/composables/useStudents'
import { useGuardians } from '~/composables/useGuardians'
import { useAdminMetrics } from '~/composables/useAdminMetrics'
import DataTable, { type Column } from '~/components/ui/DataTable.vue'
import StatusPill from '~/components/ui/StatusPill.vue'
import SubjectChip from '~/components/ui/SubjectChip.vue'
import IconTile from '~/components/ui/IconTile.vue'
import StudentFilters from '~/components/admin/StudentFilters.vue'
import type { Student } from '~/types'
import { attendanceTone, enrolTone, payTone } from '~/utils/status'
import { toneByIndex } from '~/utils/tone'

definePageMeta({ layout: 'admin' })

const students = useStudents()
const guardians = useGuardians()
const metrics = useAdminMetrics()

const filter = ref<StudentFilter>({})
const rows = computed(() => students.filter(filter.value))

// Stable colour per student so the avatar tint matches across list and detail.
const toneFor = (id: string) => toneByIndex(students.indexOf(id))
const guardianName = (id: string) => guardians.forStudent(id)?.name ?? ''

const columns: Column[] = [
  { key: 'student', label: 'Student' },
  { key: 'level', label: 'Level' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'subject', label: 'Subject' },
  { key: 'enrolment', label: 'Enrolment' },
  { key: 'payment', label: 'Payment' },
  { key: 'action', label: '', align: 'right' },
]

function open(s: Student) {
  navigateTo('/admin/students/' + s.id)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <header>
      <h1 class="font-display font-bold text-ink" style="font-size: 30px; line-height: 1.1">
        Students
      </h1>
      <p class="text-muted mt-1" style="font-size: 14px">
        {{ metrics.activeStudents }} active students, taught online
      </p>
    </header>

    <StudentFilters @change="filter = $event" />

    <DataTable :columns="columns" :rows="rows" row-key="id" :min-width="900" @row-click="open">
      <template #cell-student="{ row }">
        <div class="flex items-center gap-3">
          <IconTile :icon="row.name.charAt(0)" :tone="toneFor(row.id)" :size="40" :radius="12" />
          <div class="min-w-0">
            <div class="font-bold text-ink" style="font-size: 13.5px">{{ row.name }}</div>
            <div class="text-faint truncate" style="font-size: 11.5px; font-weight: 600">
              {{ guardianName(row.id) }}
            </div>
          </div>
        </div>
      </template>

      <template #cell-level="{ row }">
        <span class="font-bold text-ink" style="font-size: 13px">{{ row.level }}</span>
      </template>

      <template #cell-attendance="{ row }">
        <span
          class="font-semibold"
          :style="{ fontSize: '13px', color: `var(--color-fg-${attendanceTone(row.attendancePct)})` }"
        >
          {{ row.attendancePct }}%
        </span>
      </template>

      <template #cell-subject="{ row }">
        <div class="flex flex-wrap gap-1">
          <SubjectChip v-for="sub in row.subjects" :key="sub" :subject="sub" size="sm" />
        </div>
      </template>

      <template #cell-enrolment="{ row }">
        <StatusPill :tone="enrolTone(row.enrol)" :label="row.enrol" />
      </template>

      <template #cell-payment="{ row }">
        <StatusPill :tone="payTone(row.pay)" :label="row.pay" />
      </template>

      <template #cell-action>
        <span class="font-bold text-brand-deep whitespace-nowrap" style="font-size: 12px">
          View →
        </span>
      </template>
    </DataTable>
  </div>
</template>
