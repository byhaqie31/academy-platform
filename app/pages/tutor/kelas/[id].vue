<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useClasses } from '~/composables/useClasses'
import { useAcademy } from '~/composables/useAcademy'
import { useAttendance } from '~/composables/useAttendance'
import IconTile from '~/components/ui/IconTile.vue'
import AppButton from '~/components/ui/AppButton.vue'
import AttendanceRoster from '~/components/tutor/AttendanceRoster.vue'

definePageMeta({ layout: 'tutor' })

const route = useRoute()
const { branchShort } = useAcademy()
const { counts, reset } = useAttendance()

const id = computed(() => String(route.params.id))
const cls = computed(() => useClasses().byId(id.value))

// Live summary: counts() reads reactive store state, so this recomputes on every set.
const summary = computed(() =>
  cls.value ? counts(id.value, cls.value.roster) : { present: 0, late: 0, absent: 0 },
)

// "Saved" is a one-shot acknowledgement: any change to the roster invalidates it.
const saved = ref(false)

const onReset = () => {
  reset()
  saved.value = false
}
const onSave = () => {
  saved.value = true
}

const summaryPills = computed(() => [
  { label: `✓ Hadir ${summary.value.present}`, tone: 'green' },
  { label: `◐ Lewat ${summary.value.late}`, tone: 'amber' },
  { label: `✕ Tidak hadir ${summary.value.absent}`, tone: 'overdue' },
])
</script>

<template>
  <div v-if="cls" class="flex flex-col gap-[18px]">
    <NuxtLink
      to="/tutor/kelas"
      class="no-underline font-bold text-brand-deep self-start"
      style="font-size: 13px"
    >
      ← Semua kelas
    </NuxtLink>

    <!-- header card -->
    <section
      class="bg-surface"
      :style="{ border: '1px solid var(--color-border)', borderRadius: '22px', padding: '24px' }"
    >
      <div class="flex items-center gap-4 flex-wrap">
        <IconTile icon="📐" tone="pink" :size="60" :radius="18" />
        <div class="flex-1" style="min-width: 180px">
          <div class="font-display font-bold text-ink" style="font-size: 23px; line-height: 1.1">
            Matematik · {{ cls.cls }}
          </div>
          <div class="text-muted mt-0.5" style="font-size: 13.5px; font-weight: 600">
            {{ cls.day }} · {{ cls.time }} · {{ branchShort(cls.branchId) }} · {{ cls.dur }}j
          </div>
        </div>
        <div class="text-right">
          <div class="font-display font-bold text-ink" style="font-size: 22px">
            {{ cls.roster.length }}
          </div>
          <div class="text-muted font-bold uppercase" style="font-size: 11.5px">pelajar</div>
        </div>
      </div>
    </section>

    <!-- attendance card -->
    <section
      class="bg-surface"
      :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '22px' }"
    >
      <div class="flex items-center justify-between gap-3 flex-wrap" style="margin-bottom: 16px">
        <div>
          <div class="font-display font-semibold text-ink" style="font-size: 18px">
            Tanda kehadiran
          </div>
          <div class="text-muted" style="font-size: 12px; font-weight: 600">
            Sesi {{ cls.day }}, 29 Jun 2026
          </div>
        </div>
        <div class="flex gap-2 flex-wrap">
          <span
            v-for="p in summaryPills"
            :key="p.tone"
            class="inline-flex items-center gap-1.5 font-bold"
            :style="{
              padding: '7px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              background: `var(--color-tile-${p.tone})`,
              color: `var(--color-fg-${p.tone})`,
            }"
          >
            {{ p.label }}
          </span>
        </div>
      </div>

      <AttendanceRoster :class-id="id" :roster="cls.roster" @change="saved = false">
        <template #level>
          <div class="text-muted" style="font-size: 11px; font-weight: 600">{{ cls.level }}</div>
        </template>
      </AttendanceRoster>

      <div class="flex gap-3" style="margin-top: 20px">
        <AppButton variant="outline" @click="onReset">Set semula</AppButton>
        <AppButton variant="green" block @click="onSave">
          {{ saved ? 'Kehadiran disimpan ✓' : 'Simpan kehadiran' }}
        </AppButton>
      </div>
    </section>
  </div>

  <div v-else class="flex flex-col gap-4 items-start">
    <NuxtLink
      to="/tutor/kelas"
      class="no-underline font-bold text-brand-deep"
      style="font-size: 13px"
    >
      ← Semua kelas
    </NuxtLink>
    <p class="text-muted" style="font-size: 14px; font-weight: 600">
      Kelas ini tidak dijumpai.
    </p>
  </div>
</template>
