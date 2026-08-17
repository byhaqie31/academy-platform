<script setup lang="ts">
import SectionHeading from '~/components/ui/SectionHeading.vue'
import AppButton from '~/components/ui/AppButton.vue'
import TutorGrid from '~/components/marketing/TutorGrid.vue'
import InfoNote from '~/components/marketing/InfoNote.vue'
import { useSiteContent } from '~/composables/useSiteContent'

// Trust in an online centre lives on this page: who is actually in the room
// with your child every week.
definePageMeta({ layout: 'marketing' })

const { tutors } = useSiteContent()

useShareCard({
  path: '/tutors',
  title: 'Cikgu kami · {academy}',
  description: tutors.section.lede,
})
</script>

<template>
  <section class="mx-auto" style="max-width: 1120px; padding: 60px 22px 76px">
    <SectionHeading
      :label="tutors.section.eyebrow"
      :title="tutors.section.title"
      :sub="tutors.section.lede"
      class="mb-11"
    />

    <TutorGrid />

    <InfoNote :note="tutors.note" style="margin-top: 40px" />

    <div class="text-center" style="margin-top: 28px">
      <AppButton to="/register" variant="gradient" size="lg" pill>Daftar minat anak anda</AppButton>
    </div>
  </section>
</template>
