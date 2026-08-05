<!-- FROZEN ARCHIVE. Snapshot of the v1 marketing mockup, reachable only at /v1.
     Do not edit, restyle or translate. It exists to show what was built before the
     phase 1 website. Imports only ~/components/v1, ~/components/ui and ~/composables. -->

<script setup lang="ts">
import { ref } from 'vue'
import SectionHeading from '~/components/ui/SectionHeading.vue'
import IconTile from '~/components/ui/IconTile.vue'
import { useSubjects } from '~/composables/useSubjects'
import { pillStyle } from '~/utils/status'

const { marketing } = useSubjects()
const hovered = ref<number | null>(null)
</script>

<template>
  <section class="mx-auto" style="max-width: 1180px; padding: 72px 22px 20px">
    <SectionHeading
      center
      label="Subjects & programmes"
      title="Every subject that matters, under one roof"
      sub="We help plan your child's learning journey, from primary school all the way to SPM."
      class="mb-10"
    />

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px">
      <div
        v-for="(s, i) in marketing"
        :key="s.name"
        @mouseenter="hovered = i"
        @mouseleave="hovered = null"
        :style="{
          background: '#fff',
          border: '1px solid var(--color-border-marketing)',
          borderRadius: '22px',
          padding: '22px',
          boxShadow: hovered === i ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
          transform: hovered === i ? 'translateY(-4px)' : 'none',
          transition: 'transform .15s, box-shadow .15s',
        }"
      >
        <div class="flex items-start justify-between" style="gap: 10px; margin-bottom: 14px">
          <IconTile :icon="s.icon" :tone="s.tone" :size="54" :radius="16" />
          <span
            class="inline-flex items-center font-bold"
            :style="{ padding: '5px 11px', borderRadius: '999px', fontSize: '11px', ...pillStyle(s.tone) }"
          >
            {{ s.level }}
          </span>
        </div>
        <h3 class="font-display font-semibold text-ink" style="font-size: 19px; margin: 0 0 6px">{{ s.name }}</h3>
        <p style="font-size: 13.5px; color: var(--color-ink-soft); line-height: 1.5; margin: 0">{{ s.desc }}</p>
      </div>
    </div>
  </section>
</template>
