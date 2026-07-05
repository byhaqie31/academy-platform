<script setup lang="ts">
import Hero from '~/components/marketing/Hero.vue'
import TrustStrip from '~/components/marketing/TrustStrip.vue'
import SubjectGrid from '~/components/marketing/SubjectGrid.vue'
import BranchGrid from '~/components/marketing/BranchGrid.vue'
import HowToSteps from '~/components/marketing/HowToSteps.vue'
import Testimonials from '~/components/marketing/Testimonials.vue'
import WhyChooseUs from '~/components/marketing/WhyChooseUs.vue'
import CtaBanner from '~/components/marketing/CtaBanner.vue'

definePageMeta({ layout: 'marketing' })
</script>

<template>
  <Hero />
  <TrustStrip />
  <SubjectGrid />
  <BranchGrid />
  <HowToSteps />
  <Testimonials />
  <WhyChooseUs />
  <CtaBanner />
</template>
