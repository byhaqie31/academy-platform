<script setup lang="ts">
import SectionHeading from '~/components/ui/SectionHeading.vue'
import AppButton from '~/components/ui/AppButton.vue'
import SubjectCard from './SubjectCard.vue'
import { useSiteContent } from '~/composables/useSiteContent'

const { home } = useSiteContent()
</script>

<template>
  <section class="mx-auto" style="max-width: 1120px; padding: 76px 22px">
    <SectionHeading
      center
      :label="home.subjectsSection.eyebrow"
      :title="home.subjectsSection.title"
      :sub="home.subjectsSection.lede"
      class="mb-11"
    />

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px">
      <SubjectCard v-for="s in home.subjects" :key="s.name" :subject="s" />
    </div>

    <div class="text-center" style="margin-top: 34px">
      <AppButton to="/subjects" variant="outline" pill>Lihat semua subjek dan tahap</AppButton>
    </div>
  </section>
</template>
