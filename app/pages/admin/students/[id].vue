<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStudents } from '~/composables/useStudents'
import { useAcademy } from '~/composables/useAcademy'
import { useSubjects } from '~/composables/useSubjects'
import IconTile from '~/components/ui/IconTile.vue'
import StatusPill from '~/components/ui/StatusPill.vue'
import GuardianCard from '~/components/admin/GuardianCard.vue'
import PaymentHistory from '~/components/admin/PaymentHistory.vue'
import AttendanceDonut from '~/components/admin/AttendanceDonut.vue'
import { enrolTone, payTone } from '~/utils/status'
import { toneByIndex } from '~/utils/tone'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const students = useStudents()
const subjects = useSubjects()
const { branchShort } = useAcademy()

const student = computed(() => students.byId(String(route.params.id)))
const tone = computed(() => toneByIndex(students.indexOf(String(route.params.id))))

// Class name per subject, exactly as the prototype derives it (line 641).
const className = (subject: string, level: string) =>
  level + (subject === 'Matematik' ? ' Bestari' : subject === 'Sains' ? ' Amanah' : ' Cerdik')

const classes = computed(() =>
  (student.value?.subjects ?? []).map((name) => ({
    name,
    cls: className(name, student.value!.level),
    icon: subjects.byName(name)?.fluentIcon ?? 'i-fluent-book-24-regular',
    tone: subjects.byName(name)?.tone ?? 'violet',
    schedule: subjects.scheduleFor(name),
    tutor: subjects.tutorFor(name),
  })),
)

// Attendance counts derived from the percentage over a realistic 30-day window.
const attendance = computed(() => {
  const pct = student.value?.attendancePct ?? 0
  const total = 26
  const present = Math.round((pct / 100) * total)
  const missed = total - present
  const late = Math.min(missed, Math.round(missed / 3))
  const absent = missed - late
  return { present, absent, late }
})
</script>

<template>
  <div v-if="student" class="flex flex-col gap-[18px]">
    <NuxtLink
      to="/admin/students"
      class="no-underline font-bold text-brand-deep self-start"
      style="font-size: 13px"
    >
      ← All students
    </NuxtLink>

    <!-- header card -->
    <section
      class="bg-surface"
      :style="{ border: '1px solid var(--color-border)', borderRadius: '22px', padding: '26px' }"
    >
      <div class="flex items-center gap-4 flex-wrap">
        <IconTile :icon="student.name.charAt(0)" :tone="tone" :size="64" :radius="18" />
        <div class="flex-1" style="min-width: 180px">
          <div class="font-display font-bold text-ink" style="font-size: 24px; line-height: 1.1">
            {{ student.name }}
          </div>
          <div class="text-muted mt-0.5" style="font-size: 13.5px; font-weight: 600">
            {{ student.level }} · {{ branchShort(student.branchId) }}
          </div>
        </div>
        <StatusPill :tone="enrolTone(student.enrol)" :label="'● ' + student.enrol" />
        <StatusPill :tone="payTone(student.pay)" :label="'Payment: ' + student.pay" />
      </div>
    </section>

    <div class="grid gap-[18px] lg:grid-cols-[1.5fr_1fr] items-start">
      <!-- LEFT -->
      <div class="flex flex-col gap-[18px]">
        <section
          class="bg-surface"
          :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '22px' }"
        >
          <h2 class="font-display font-semibold text-ink mb-4" style="font-size: 17px">
            Subjects and classes enrolled
          </h2>
          <div class="flex flex-col gap-2.5">
            <div
              v-for="c in classes"
              :key="c.name"
              class="flex items-center gap-3.5"
              :style="{
                padding: '13px 14px',
                borderRadius: '15px',
                background: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-divider)',
              }"
            >
              <IconTile :icon="c.icon" :tone="c.tone" :size="42" :radius="12" />
              <div class="min-w-0 flex-1">
                <div class="font-bold text-ink" style="font-size: 14px">
                  {{ c.name }}
                  <span class="text-faint" style="font-weight: 600; font-size: 12px">· {{ c.cls }}</span>
                </div>
                <div class="text-faint mt-0.5" style="font-size: 12px; font-weight: 600">
                  {{ c.schedule }} · {{ c.tutor }}
                </div>
              </div>
            </div>
          </div>
        </section>

        <PaymentHistory :student-id="student.id" />
      </div>

      <!-- RIGHT -->
      <div class="flex flex-col gap-[18px]">
        <GuardianCard :student-id="student.id" :first-name="student.first" />

        <section
          class="bg-surface"
          :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '22px' }"
        >
          <h2 class="font-display font-semibold text-ink" style="font-size: 17px">
            Attendance summary
          </h2>
          <p class="text-faint" style="font-size: 12px; font-weight: 600; margin-top: 2px">
            Last 30 days
          </p>

          <div class="flex items-center gap-[18px] mt-4">
            <AttendanceDonut :pct="student.attendancePct" />
            <div class="flex-1 flex flex-col gap-2.5">
              <div class="flex items-center justify-between">
                <span class="text-ink-soft" style="font-size: 12.5px; font-weight: 600">✓ Present</span>
                <span class="font-extrabold text-ink" style="font-size: 13px">{{ attendance.present }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-ink-soft" style="font-size: 12.5px; font-weight: 600">✕ Absent</span>
                <span class="font-extrabold text-ink" style="font-size: 13px">{{ attendance.absent }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-ink-soft" style="font-size: 12.5px; font-weight: 600">◐ Late</span>
                <span class="font-extrabold text-ink" style="font-size: 13px">{{ attendance.late }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
