<script setup lang="ts">
import SubjectCard from './SubjectCard.vue'
import { useSubjects } from '~/composables/useSubjects'

// Grouped into Sekolah Rendah, Menengah Rendah and Menengah Atas. Each subject
// carries a blurb written for that stage: Matematik reads differently at
// Tahun 3 than it does at SPM.
const { byStage } = useSubjects()
const groups = byStage()
</script>

<template>
  <div>
    <section v-for="group in groups" :key="group.key">
      <div class="flex flex-wrap items-center gap-3" style="margin: 44px 0 20px">
        <h3 class="font-display font-semibold text-ink" style="font-size: 21px; margin: 0">
          {{ group.title }}
        </h3>
        <span
          class="font-bold"
          :style="{
            background: 'var(--color-tile-violet)',
            color: 'var(--color-fg-violet)',
            fontSize: '12.5px',
            padding: '5px 13px',
            borderRadius: 'var(--radius-pill)',
          }"
        >
          {{ group.tag }}
        </span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px">
        <SubjectCard v-for="s in group.subjects" :key="s.name" :subject="s" />
      </div>
    </section>
  </div>
</template>
