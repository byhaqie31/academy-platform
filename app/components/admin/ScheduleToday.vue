<script setup lang="ts">
import { useSchedule } from '~/composables/useSchedule'
import SubjectChip from '~/components/ui/SubjectChip.vue'
import { toneFg } from '~/utils/tone'

const rows = useSchedule().todayAgenda()
</script>

<template>
  <section
    class="bg-surface"
    :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '20px' }"
  >
    <div class="flex items-center justify-between mb-4">
      <h2 class="font-display font-semibold text-ink" style="font-size: 16px">Today's schedule</h2>
      <NuxtLink to="/admin/schedule" class="no-underline font-bold text-brand-deep" style="font-size: 12.5px">
        View full schedule →
      </NuxtLink>
    </div>

    <ul class="flex flex-col">
      <li
        v-for="(r, i) in rows"
        :key="i"
        class="flex items-center gap-3.5 py-3"
        :style="{ borderTop: i === 0 ? 'none' : '1px solid var(--color-divider)' }"
      >
        <div class="text-right shrink-0" style="width: 52px">
          <div class="font-display font-bold text-ink" style="font-size: 15px">{{ r.time }}</div>
          <div class="font-bold text-faint uppercase" style="font-size: 9px; letter-spacing: 0.04em">{{ r.ampm }}</div>
        </div>
        <div :style="{ width: '4px', alignSelf: 'stretch', borderRadius: '999px', background: toneFg(r.tone) }" />
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <SubjectChip :subject="r.subject" size="sm" />
            <span class="font-bold text-ink truncate" style="font-size: 13.5px">{{ r.cls }}</span>
          </div>
          <div class="text-faint mt-0.5" style="font-size: 11.5px; font-weight: 600">
            {{ r.tutor }}
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>
