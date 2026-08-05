<!-- FROZEN ARCHIVE. Snapshot of the v1 marketing mockup, reachable only at /v1.
     Do not edit, restyle or translate. It exists to show what was built before the
     phase 1 website. Imports only ~/components/v1, ~/components/ui and ~/composables. -->

<script setup lang="ts">
import V1Hero from '~/components/v1/V1Hero.vue'
import V1TrustStrip from '~/components/v1/V1TrustStrip.vue'
import V1SubjectGrid from '~/components/v1/V1SubjectGrid.vue'
import V1BranchGrid from '~/components/v1/V1BranchGrid.vue'
import V1HowToSteps from '~/components/v1/V1HowToSteps.vue'
import V1Testimonials from '~/components/v1/V1Testimonials.vue'
import V1WhyChooseUs from '~/components/v1/V1WhyChooseUs.vue'
import V1CtaBanner from '~/components/v1/V1CtaBanner.vue'

definePageMeta({ layout: 'v1' })

useHead({ title: 'Hz Academy · v1 archive' })
</script>

<template>
  <V1Hero />
  <V1TrustStrip />
  <V1SubjectGrid />
  <V1BranchGrid />
  <V1HowToSteps />
  <V1Testimonials />
  <V1WhyChooseUs />
  <V1CtaBanner />
</template>
