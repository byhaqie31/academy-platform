<script setup lang="ts">
import Hero from '~/components/marketing/Hero.vue'
import TrustStrip from '~/components/marketing/TrustStrip.vue'
import SubjectGrid from '~/components/marketing/SubjectGrid.vue'
import HowToSteps from '~/components/marketing/HowToSteps.vue'
import Testimonials from '~/components/marketing/Testimonials.vue'
import CtaBanner from '~/components/marketing/CtaBanner.vue'

// BranchGrid and WhyChooseUs are deliberately absent. Hz is fully online now,
// so there are no branches to show; both components survive in /v1 and remain
// on disk for a centre that still teaches in person.
definePageMeta({ layout: 'marketing' })

useHead({
  title: 'Hz Academy · Tuisyen online dipercayai sejak 2014',
  meta: [
    {
      name: 'description',
      content:
        'Pusat tuisyen online Hz Academy. Kelas langsung kumpulan kecil, cikgu bertauliah, ' +
        'dari Tahun 1 hingga SPM. Dipercayai sejak 2014.',
    },
  ],
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
