<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import IconTile from '~/components/ui/IconTile.vue'
import SubjectChip from '~/components/ui/SubjectChip.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import EducatorHoursBars from '~/components/admin/EducatorHoursBars.vue'
import { useEducators } from '~/composables/useEducators'
import { usePayroll } from '~/composables/usePayroll'
import { useClasses } from '~/composables/useClasses'
import { useSubjects } from '~/composables/useSubjects'
import { useAcademy } from '~/composables/useAcademy'
import { formatRM } from '~/utils/money'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const id = computed(() => String(route.params.id))

const { byId, estimatedPay } = useEducators()
const { weeklyBreakdown } = usePayroll()
const { forEducator } = useClasses()
const subjects = useSubjects()
const { branchShort } = useAcademy()

const e = computed(() => byId(id.value))
const classes = computed(() => forEducator(id.value))
const weeks = computed(() => weeklyBreakdown(id.value))
const pay = computed(() => (e.value ? estimatedPay(e.value.id) : 0))
</script>

<template>
  <div v-if="e" class="flex flex-col gap-6">
    <NuxtLink
      to="/admin/educators"
      class="inline-flex items-center text-muted hover:text-ink transition-colors"
      style="font-size: 13px; font-weight: 600; width: fit-content"
    >
      ← Semua pendidik
    </NuxtLink>

    <div class="grid gap-5 lg:grid-cols-[340px_1fr] items-start">
      <!-- LEFT: profile + pay -->
      <div class="flex flex-col gap-5">
        <div
          class="bg-surface text-center"
          :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '24px' }"
        >
          <div class="mx-auto" style="width: fit-content; margin-bottom: 14px">
            <IconTile :icon="e.first.charAt(0)" :tone="e.tone" :size="74" :radius="22" />
          </div>
          <div class="font-display font-bold text-ink" style="font-size: 21px">{{ e.name }}</div>
          <div class="text-faint" style="font-size: 13px; font-weight: 600; margin-bottom: 14px">
            Pendidik · {{ e.branches }}
          </div>
          <div class="flex flex-wrap justify-center" style="gap: 5px; margin-bottom: 18px">
            <SubjectChip v-for="s in e.subjects" :key="s" :subject="s" size="full" />
          </div>
          <div class="flex" style="gap: 10px">
            <div
              class="flex-1"
              :style="{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-divider)', borderRadius: '14px', padding: '13px' }"
            >
              <div class="text-faint" style="font-size: 10.5px; font-weight: 700">KADAR / JAM</div>
              <div class="font-display font-bold text-ink" style="font-size: 18px">
                {{ formatRM(e.rate) }} /j
              </div>
            </div>
            <div
              class="flex-1"
              :style="{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-divider)', borderRadius: '14px', padding: '13px' }"
            >
              <div class="text-faint" style="font-size: 10.5px; font-weight: 700">JAM BLN INI</div>
              <div class="font-display font-bold text-ink" style="font-size: 18px">{{ e.hours }} j</div>
            </div>
          </div>
        </div>

        <!-- dark estimated-pay card -->
        <div
          class="text-white"
          :style="{ background: 'var(--hero-dark-gradient)', borderRadius: '20px', padding: '22px', boxShadow: 'var(--shadow-revenue)' }"
        >
          <div
            class="uppercase"
            :style="{ fontSize: '11.5px', fontWeight: 700, color: '#B9BDD6', letterSpacing: '0.05em', marginBottom: '8px' }"
          >
            Anggaran gaji · Jun 2026
          </div>
          <div class="font-display font-bold" style="font-size: 36px; line-height: 1">
            {{ formatRM(pay) }}
          </div>
          <p style="font-size: 12.5px; color: #b9bdd6; font-weight: 600; margin: 12px 0 0; line-height: 1.5">
            {{ e.hours }} jam × {{ formatRM(e.rate) }}/jam, dikira automatik dari sesi yang direkodkan.
          </p>
        </div>
      </div>

      <!-- RIGHT: classes + hours bars -->
      <div class="flex flex-col gap-5">
        <div
          class="bg-surface"
          :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '22px' }"
        >
          <div class="font-display font-semibold text-ink" style="font-size: 17px; margin-bottom: 14px">
            Kelas ditugaskan
          </div>
          <div class="flex flex-col" style="gap: 10px">
            <div
              v-for="c in classes"
              :key="c.id"
              class="flex items-center"
              :style="{ gap: '13px', padding: '13px 14px', borderRadius: '15px', background: 'var(--color-surface-subtle)', border: '1px solid var(--color-divider)' }"
            >
              <IconTile
                :icon="subjects.byName(c.subject)?.icon ?? '📘'"
                :tone="subjects.toneOf(c.subject)"
                :size="42"
                :radius="12"
              />
              <div class="flex-1 min-w-0">
                <div class="font-bold text-ink" style="font-size: 14px">
                  {{ c.subject }}
                  <span class="text-faint" style="font-weight: 600; font-size: 12px">· {{ c.cls }}</span>
                </div>
                <div class="text-muted" style="font-size: 12px; font-weight: 600; margin-top: 2px">
                  {{ c.day }} {{ c.time }} · {{ branchShort(c.branchId) }}
                </div>
              </div>
              <span style="font-weight: 800; font-size: 13px; color: var(--color-brand-deep); flex: none">
                {{ c.dur }}j
              </span>
            </div>
          </div>
        </div>

        <EducatorHoursBars :weeks="weeks" />
      </div>
    </div>
  </div>

  <EmptyState v-else icon="🧑‍🏫" title="Pendidik tidak dijumpai" desc="Kembali ke senarai pendidik." />
</template>
