<script setup lang="ts">
import { computed } from 'vue'
import { useLessonPlans } from '~/composables/useLessonPlans'
import StatusPill from '~/components/ui/StatusPill.vue'

const plans = computed(() => useLessonPlans().forEducator('hafiz').slice(0, 3))
</script>

<template>
  <section
    class="bg-surface"
    :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '20px' }"
  >
    <div class="flex items-center justify-between mb-4">
      <h2 class="font-display font-semibold text-ink" style="font-size: 16px">This week's plans</h2>
      <NuxtLink to="/tutor/lesson-plans" class="no-underline font-bold text-brand-deep" style="font-size: 12.5px">
        All →
      </NuxtLink>
    </div>

    <ul class="flex flex-col">
      <li
        v-for="(p, i) in plans"
        :key="p.id"
        class="flex items-center gap-3 py-3"
        :style="{ borderTop: i === 0 ? 'none' : '1px solid var(--color-divider)' }"
      >
        <div class="min-w-0 flex-1">
          <div class="font-bold text-ink truncate" style="font-size: 13px">{{ p.cls }}</div>
          <div class="text-faint mt-0.5 truncate" style="font-size: 11.5px; font-weight: 600">{{ p.topic }}</div>
        </div>
        <StatusPill
          v-if="p.attached"
          tone="green"
          label="Done"
        />
        <StatusPill
          v-else
          tone="amber"
          label="Needed"
        />
      </li>
    </ul>
  </section>
</template>
