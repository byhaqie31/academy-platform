<script setup lang="ts">
import SectionHeading from '~/components/ui/SectionHeading.vue'
import HowItWorksDetail from '~/components/marketing/HowItWorksDetail.vue'
import StepCards from '~/components/marketing/StepCards.vue'
import FaqAccordion from '~/components/marketing/FaqAccordion.vue'
import { useSiteContent } from '~/composables/useSiteContent'
import { useFaqs } from '~/composables/useFaqs'

// This page exists to kill the biggest objection to an online centre, so it
// runs long: the honest explanation, then the first week, then the questions.
definePageMeta({ layout: 'marketing' })

const { howItWorks, faqSection } = useSiteContent()
const { set } = useFaqs()
const faqs = set('website')

useShareCard({
  path: '/how-it-works',
  title: 'Cara ia berfungsi · {academy}',
  description: howItWorks.section.lede,
})
</script>

<template>
  <section class="mx-auto" style="max-width: 1120px; padding: 60px 22px 76px">
    <SectionHeading
      :label="howItWorks.section.eyebrow"
      :title="howItWorks.section.title"
      :sub="howItWorks.section.lede"
      class="mb-11"
    />
    <HowItWorksDetail />
  </section>

  <section :style="{ background: 'var(--color-surface-lavender)' }">
    <div class="mx-auto" style="max-width: 1120px; padding: 76px 22px">
      <SectionHeading
        center
        :label="howItWorks.firstWeekSection.eyebrow"
        :title="howItWorks.firstWeekSection.title"
        class="mb-11"
      />
      <StepCards :steps="howItWorks.firstWeekSteps" />
    </div>
  </section>

  <section class="mx-auto" style="max-width: 820px; padding: 76px 22px">
    <SectionHeading center :label="faqSection.eyebrow" :title="faqSection.title" class="mb-11" />
    <FaqAccordion :faqs="faqs" />
  </section>
</template>
