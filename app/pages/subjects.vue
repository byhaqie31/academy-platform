<script setup lang="ts">
import SectionHeading from '~/components/ui/SectionHeading.vue'
import AppButton from '~/components/ui/AppButton.vue'
import SubjectsByStage from '~/components/marketing/SubjectsByStage.vue'
import InfoNote from '~/components/marketing/InfoNote.vue'
import { useSiteContent } from '~/composables/useSiteContent'

definePageMeta({ layout: 'marketing' })

const { subjects } = useSiteContent()

useHead({
  title: 'Subjek dan tahap · Hz Academy',
  meta: [{ name: 'description', content: subjects.section.lede }],
})
</script>

<template>
  <section class="mx-auto" style="max-width: 1120px; padding: 60px 22px 76px">
    <SectionHeading
      :label="subjects.section.eyebrow"
      :title="subjects.section.title"
      :sub="subjects.section.lede"
    />

    <SubjectsByStage />

    <InfoNote :note="subjects.note" style="margin-top: 44px" />

    <div class="text-center" style="margin-top: 28px">
      <AppButton to="/register" variant="gradient" size="lg" pill>Daftar minat anak anda</AppButton>
    </div>
  </section>
</template>
