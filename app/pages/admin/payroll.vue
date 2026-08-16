<script setup lang="ts">
import { computed, ref } from 'vue'
import DataTable, { type Column } from '~/components/ui/DataTable.vue'
import StatCard from '~/components/ui/StatCard.vue'
import IconTile from '~/components/ui/IconTile.vue'
import SubjectChip from '~/components/ui/SubjectChip.vue'
import AppButton from '~/components/ui/AppButton.vue'
import EducatorHoursBars from '~/components/admin/EducatorHoursBars.vue'
import { usePayroll } from '~/composables/usePayroll'
import { useClasses } from '~/composables/useClasses'
import { formatRM } from '~/utils/money'

definePageMeta({ layout: 'admin' })

const PERIOD = 'Jun 2026'

const payroll = usePayroll()
const classes = useClasses()
const toast = useToast()

const board = computed(() => payroll.board(PERIOD))

// The educator whose breakdown is open, if any.
const openId = ref<string | null>(null)
const openRow = computed(() => board.value.rows.find((r) => r.educatorId === openId.value) ?? null)
const openWeeks = computed(() => (openId.value ? payroll.weeklyBreakdown(openId.value) : []))
const openClasses = computed(() =>
  openId.value
    ? payroll.byClass(openId.value).map((c) => ({ ...c, cls: classes.byId(c.classId)?.cls ?? c.classId }))
    : [],
)

function toggle(educatorId: string) {
  openId.value = openId.value === educatorId ? null : educatorId
}

const stats = computed(() => [
  {
    icon: 'i-fluent-money-24-regular',
    tone: 'green' as const,
    value: formatRM(board.value.total),
    label: `${PERIOD} payroll`,
    // Scoped to the educators on file, like every other inspectable slice in
    // the mockup. The dashboard carries the centre-wide figure.
    sub: `the ${board.value.rows.length} educators on file`,
  },
  {
    icon: 'i-fluent-people-24-regular',
    tone: 'blue' as const,
    value: String(board.value.rows.length),
    label: 'Educators paid',
    sub: 'this period',
  },
  {
    icon: 'i-fluent-timer-24-regular',
    tone: 'violet' as const,
    value: `${board.value.hours} h`,
    label: 'Hours logged',
    sub: 'every hour taught',
  },
])

const columns: Column[] = [
  { key: 'educator', label: 'Educator' },
  { key: 'subjects', label: 'Subject' },
  { key: 'hours', label: 'Hours', align: 'right' },
  { key: 'rate', label: 'Rate', align: 'right' },
  { key: 'amount', label: 'Pay', align: 'right' },
  { key: 'action', label: '', align: 'right' },
]

function downloadPayslip(name: string) {
  toast.add({
    title: 'Payslip queued',
    description: `${name}'s payslip for ${PERIOD} would be generated and sent.`,
    icon: 'i-fluent-document-24-regular',
  })
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <header class="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h1 class="font-display font-bold text-ink" style="font-size: 28px; line-height: 1.1">
          Payroll
        </h1>
        <p class="text-muted mt-1" style="font-size: 13.5px; font-weight: 600">
          {{ PERIOD }} · every figure calculated from recorded teaching hours, never typed in
        </p>
      </div>
    </header>

    <div class="grid gap-4 sm:grid-cols-3">
      <StatCard v-for="s in stats" :key="s.label" v-bind="s" />
    </div>

    <DataTable :columns="columns" :rows="board.rows" row-key="educatorId" :min-width="820">
      <template #cell-educator="{ row }">
        <div class="flex items-center gap-3">
          <IconTile :icon="row.first.charAt(0)" :tone="row.tone" :size="38" :radius="11" />
          <span class="font-bold text-ink" style="font-size: 13.5px">{{ row.name }}</span>
        </div>
      </template>

      <template #cell-subjects="{ row }">
        <div class="flex flex-wrap" style="gap: 4px">
          <SubjectChip v-for="s in row.subjects" :key="s" :subject="s" size="sm" />
        </div>
      </template>

      <template #cell-hours="{ row }">
        <span class="font-semibold text-ink-soft" style="font-size: 13px">{{ row.hours }} h</span>
      </template>

      <template #cell-rate="{ row }">
        <span class="text-ink-soft" style="font-size: 13px; font-weight: 600">
          {{ formatRM(row.rate) }} / h
        </span>
      </template>

      <template #cell-amount="{ row }">
        <span class="font-display font-bold text-ink" style="font-size: 14px">
          {{ formatRM(row.amount) }}
        </span>
      </template>

      <template #cell-action="{ row }">
        <button
          type="button"
          class="cursor-pointer font-bold whitespace-nowrap"
          :style="{
            background: openId === row.educatorId ? 'var(--color-tile-violet)' : 'transparent',
            color: 'var(--color-brand-deep)',
            border: 'none',
            padding: '6px 11px',
            borderRadius: '9px',
            fontSize: '12px',
          }"
          @click="toggle(row.educatorId)"
        >
          {{ openId === row.educatorId ? 'Hide breakdown' : 'Breakdown' }}
        </button>
      </template>
    </DataTable>

    <!-- Breakdown for one educator: the same numbers, shown the way the tutor
         sees them on their own payslip. -->
    <section v-if="openRow" class="grid gap-5 lg:grid-cols-[1fr_1fr] items-start">
      <EducatorHoursBars :weeks="openWeeks" />

      <div
        class="bg-surface"
        :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '22px' }"
      >
        <div class="flex items-center justify-between gap-3 flex-wrap" style="margin-bottom: 14px">
          <div class="font-display font-semibold text-ink" style="font-size: 17px">
            {{ openRow.name }} · pay by class
          </div>
          <AppButton variant="outline" size="sm" @click="downloadPayslip(openRow.name)">
            Download payslip
          </AppButton>
        </div>

        <div class="flex flex-col" style="gap: 9px">
          <div
            v-for="c in openClasses"
            :key="c.classId"
            class="flex items-center justify-between gap-3"
            :style="{
              padding: '12px 14px',
              borderRadius: '14px',
              background: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-divider)',
            }"
          >
            <span class="font-semibold text-ink truncate" style="font-size: 13px">{{ c.cls }}</span>
            <span class="text-muted shrink-0" style="font-size: 12.5px; font-weight: 600">
              {{ c.hours }} h · {{ formatRM(c.amount) }}
            </span>
          </div>
        </div>

        <div
          class="flex items-center justify-between"
          :style="{ marginTop: '14px', paddingTop: '13px', borderTop: '1px solid var(--color-divider)' }"
        >
          <span class="font-bold text-ink-soft" style="font-size: 13px">
            {{ openRow.hours }} hours × {{ formatRM(openRow.rate) }}
          </span>
          <span class="font-display font-bold text-ink" style="font-size: 19px">
            {{ formatRM(openRow.amount) }}
          </span>
        </div>

        <p class="text-faint" style="font-size: 11.5px; font-weight: 600; margin: 11px 0 0; line-height: 1.5">
          This is the same figure {{ openRow.first }} sees on their own payslip. Both are derived
          from the same recorded sessions.
        </p>
      </div>
    </section>
  </div>
</template>
