<script setup lang="ts">
import { useEducators } from '~/composables/useEducators'
import { useLessonPlans } from '~/composables/useLessonPlans'
import AppButton from '~/components/ui/AppButton.vue'
import LessonPlanCard from '~/components/tutor/LessonPlanCard.vue'

definePageMeta({ layout: 'tutor' })

const self = useEducators().self()
const plans = useLessonPlans().forEducator(self.id)
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h1 class="font-display font-bold text-ink" :style="{ fontSize: '30px', lineHeight: '1.1' }">
          Lesson plans
        </h1>
        <p class="text-muted" :style="{ fontSize: '14px', marginTop: '4px' }">Lesson plans</p>
      </div>
      <AppButton variant="dark">+ New attachment</AppButton>
    </header>

    <div
      :style="{
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      }"
    >
      <LessonPlanCard v-for="plan in plans" :key="plan.id" :plan="plan" />
    </div>
  </div>
</template>
