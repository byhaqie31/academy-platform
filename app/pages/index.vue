<script setup lang="ts">
import Hero from '~/components/marketing/Hero.vue'
import TrustStrip from '~/components/marketing/TrustStrip.vue'
import SubjectGrid from '~/components/marketing/SubjectGrid.vue'
import HowToSteps from '~/components/marketing/HowToSteps.vue'
import Testimonials from '~/components/marketing/Testimonials.vue'
import CtaBanner from '~/components/marketing/CtaBanner.vue'

// WhyChooseUs is deliberately absent, and there is no branch section at all:
// Hz is fully online, so there are no locations to show. The frozen /v1 archive
// keeps its own V1BranchGrid, which is where the branch layout still lives.
definePageMeta({ layout: 'marketing' })

useShareCard({
  path: '/',
  title: '{academy} · Tuisyen online dipercayai sejak 2014',
  description:
    'Pusat tuisyen online {academy}. Kelas langsung kumpulan kecil, cikgu bertauliah, ' +
    'dari Tahun 1 hingga SPM. Dipercayai sejak 2014.',
})
</script>

<template>
  <Hero />
  <TrustStrip />
  <SubjectGrid />
  <HowToSteps />
  <Testimonials />
  <CtaBanner />
</template>
