<script setup lang="ts">
import SectionHeading from '~/components/ui/SectionHeading.vue'
import AppButton from '~/components/ui/AppButton.vue'
import StepCards from './StepCards.vue'
import { useSiteContent } from '~/composables/useSiteContent'

const { home } = useSiteContent()
</script>

<template>
  <section :style="{ background: 'var(--color-surface-lavender)' }">
    <div class="mx-auto" style="max-width: 1120px; padding: 76px 22px">
      <SectionHeading
        center
        :label="home.stepsSection.eyebrow"
        :title="home.stepsSection.title"
        :sub="home.stepsSection.lede"
        class="mb-11"
      />

      <StepCards :steps="home.steps" />

      <div class="text-center" style="margin-top: 34px">
        <AppButton to="/how-it-works" variant="outline" pill>Baca dengan lebih lanjut</AppButton>
      </div>
    </div>
  </section>
</template>
