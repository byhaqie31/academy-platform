<script setup lang="ts">
import { computed } from 'vue'
import { useEducators } from '~/composables/useEducators'
import { useClasses } from '~/composables/useClasses'
import { useAcademy } from '~/composables/useAcademy'
import SubjectChip from '~/components/ui/SubjectChip.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { toneFg } from '~/utils/tone'

const self = useEducators().self()
const { branchShort } = useAcademy()

// Today is Mon in the prototype's curated snapshot.
const rows = computed(() =>
  useClasses()
    .forEducator(self.id)
    .filter((c) => c.day === 'Mon'),
)
</script>

<template>
  <section
    class="bg-surface"
    :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '20px' }"
  >
    <div class="flex items-center justify-between mb-4">
      <h2 class="font-display font-semibold text-ink" style="font-size: 16px">Kelas hari ini</h2>
      <NuxtLink to="/tutor/schedule" class="no-underline font-bold text-brand-deep" style="font-size: 12.5px">
        Lihat jadual →
      </NuxtLink>
    </div>

    <ul class="flex flex-col">
      <li
        v-for="(c, i) in rows"
        :key="c.id"
        class="flex items-center gap-3.5 py-3.5"
        :style="{ borderTop: i === 0 ? 'none' : '1px solid var(--color-divider)' }"
      >
        <div class="text-right shrink-0" style="width: 52px">
          <div class="font-display font-bold text-ink" style="font-size: 15px">{{ c.time.replace(/ ?[AP]M$/, '') }}</div>
          <div class="font-bold text-faint uppercase" style="font-size: 9px; letter-spacing: 0.04em">{{ c.ampm }}</div>
        </div>
        <div :style="{ width: '4px', alignSelf: 'stretch', borderRadius: '999px', background: toneFg('pink') }" />
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <SubjectChip subject="Matematik" size="sm" />
            <span class="font-bold text-ink truncate" style="font-size: 13.5px">{{ c.cls }}</span>
          </div>
          <div class="text-faint mt-0.5" style="font-size: 11.5px; font-weight: 600">
            {{ c.roster.length }} pelajar · {{ branchShort(c.branchId) }} · {{ c.dur }}j
          </div>
        </div>
        <AppButton variant="soft" size="sm" :to="`/tutor/classes/${c.id}`">Tanda kehadiran →</AppButton>
      </li>
    </ul>
  </section>
</template>
