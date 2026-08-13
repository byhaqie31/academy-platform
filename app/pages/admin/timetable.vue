<script setup lang="ts">
import { computed } from 'vue'
import { useSchedule } from '~/composables/useSchedule'
import { useHostPool } from '~/composables/useHostPool'
import { useAdminMetrics } from '~/composables/useAdminMetrics'
import StatCard from '~/components/ui/StatCard.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { toneTile, toneFg } from '~/utils/tone'

definePageMeta({ layout: 'admin' })

const schedule = useSchedule()
const pool = useHostPool()
const metrics = useAdminMetrics()

const rows = computed(() => schedule.grid())
const days = schedule.days

/** the three numbers that must agree, shown together */
function slotStats(time: string) {
  const used = days.reduce((n, d) => n + pool.usedIn(d, time), 0)
  const peak = Math.max(0, ...days.map((d) => pool.usedIn(d, time)))
  return { used, peak, free: Math.max(0, pool.capacity - peak) }
}

const totalClasses = computed(() => rows.value.reduce((n, r) => n + r.cells.filter(Boolean).length, 0))
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h1 class="font-display font-bold text-ink" style="font-size: 30px; line-height: 1.1">
          Timetable
        </h1>
        <p class="text-muted mt-1" style="font-size: 14px">
          Admin owns what runs and when · {{ totalClasses }} classes across {{ days.length }} days
        </p>
      </div>
      <AppButton variant="dark">+ Add class</AppButton>
    </header>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard icon="i-fluent-calendar-ltr-24-regular" tone="violet" :value="String(totalClasses)" label="Classes scheduled" sub="this week" />
      <StatCard icon="i-fluent-ticket-diagonal-24-regular" tone="blue" :value="`${pool.size} / ${pool.capacity}`" label="Licences needed" sub="peak concurrency, not headcount" />
      <StatCard icon="i-fluent-people-24-regular" tone="green" :value="String(metrics.classesActive)" label="Classes active" sub="centre-wide" />
      <StatCard icon="i-fluent-location-24-regular" tone="amber" :value="String(metrics.branchesActive)" label="Branches" sub="all running" />
    </div>

    <section
      class="bg-surface"
      :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '20px' }"
    >
      <div class="flex items-center gap-3 flex-wrap" :style="{ marginBottom: '16px' }">
        <span
          v-for="s in schedule.subjectLegend"
          :key="s.name"
          class="flex items-center gap-1.5 font-semibold text-ink-soft"
          :style="{ fontSize: '12px' }"
        >
          <span :style="{ width: '12px', height: '12px', borderRadius: '4px', background: toneFg(s.tone) }" />
          {{ s.name }}
        </span>
      </div>

      <div class="hz-scroll">
        <table class="w-full border-collapse" :style="{ minWidth: '940px' }">
          <thead>
            <tr>
              <th
                class="uppercase font-extrabold text-faint text-left"
                :style="{ padding: '10px 12px', fontSize: '11px', letterSpacing: '0.04em', width: '92px' }"
              >
                Slot
              </th>
              <th
                v-for="d in days"
                :key="d"
                class="uppercase font-extrabold text-faint text-left"
                :style="{ padding: '10px 12px', fontSize: '11px', letterSpacing: '0.04em' }"
              >
                {{ d }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="row in rows" :key="row.time">
              <tr :style="{ borderTop: '1px solid var(--color-divider)' }">
                <td
                  class="font-semibold text-ink-soft align-top"
                  :style="{ padding: '12px', fontSize: '12.5px', whiteSpace: 'nowrap' }"
                >
                  {{ row.time }}
                </td>
                <td
                  v-for="(cell, i) in row.cells"
                  :key="i"
                  class="align-top"
                  :style="{ padding: '7px 6px' }"
                >
                  <div
                    v-if="cell"
                    :style="{
                      background: toneTile(cell.tone),
                      borderRadius: '12px',
                      padding: '9px 11px',
                      minHeight: '58px',
                    }"
                  >
                    <div class="font-bold truncate" :style="{ color: toneFg(cell.tone), fontSize: '12.5px' }">
                      {{ cell.subject }}
                    </div>
                    <div class="font-semibold truncate" :style="{ color: 'var(--color-ink-soft)', fontSize: '11px', marginTop: '1px' }">
                      {{ cell.cls }}
                    </div>
                    <div class="truncate" :style="{ color: 'var(--color-muted)', fontSize: '10.5px', marginTop: '2px' }">
                      {{ cell.tutor }} · {{ cell.branch }}
                    </div>
                  </div>
                  <div
                    v-else
                    :style="{
                      background: 'var(--dashed-stripes)',
                      borderRadius: '12px',
                      minHeight: '58px',
                      opacity: 0.55,
                    }"
                  />
                </td>
              </tr>
              <tr>
                <td :colspan="days.length + 1" :style="{ padding: '0 12px 10px' }">
                  <div
                    class="flex items-center gap-4 flex-wrap font-semibold"
                    :style="{
                      background: 'var(--color-surface-subtle)',
                      borderRadius: '10px',
                      padding: '7px 11px',
                      fontSize: '11.5px',
                      color: 'var(--color-ink-soft)',
                    }"
                  >
                    <span>{{ slotStats(row.time).used }} classes at this time this week</span>
                    <span :style="{ color: 'var(--color-fg-blue)' }">
                      {{ slotStats(row.time).peak }} running at once
                    </span>
                    <span :style="{ color: slotStats(row.time).free > 0 ? 'var(--color-fg-green)' : 'var(--color-fg-overdue)' }">
                      {{ slotStats(row.time).free }} licences free
                    </span>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <p class="text-muted" :style="{ fontSize: '12.5px', margin: '14px 0 0', lineHeight: '1.55' }">
        A licence is not a person. One licensed host runs one room at a time, so tutors teaching in
        different slots share one. Over-subscription is refused here, when a class is created,
        rather than discovered at 8pm.
      </p>
    </section>
  </div>
</template>
