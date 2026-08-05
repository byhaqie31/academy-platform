<script setup lang="ts">
import SectionHeading from '~/components/ui/SectionHeading.vue'
import IconTile from '~/components/ui/IconTile.vue'
import { tonePair } from '~/utils/tone'
import type { SubjectTone } from '~/types'

// pure presentation content: why parents choose the academy
const benefits: { icon: string; title: string; desc: string; proof: string; tone: SubjectTone }[] = [
  {
    icon: '🎓',
    title: 'Certified and experienced tutors',
    desc: 'Taught by trained tutors who know the KPM syllabus and know how to make sure your child really understands.',
    proof: '50+ experienced tutors',
    tone: 'violet',
  },
  {
    icon: '👥',
    title: 'Small group classes',
    desc: 'Small groups, so every child gets attention, not just a number in the class.',
    proof: 'Average of 8 students per class',
    tone: 'pink',
  },
  {
    icon: '📈',
    title: 'Proven results',
    desc: 'Structured practice and close monitoring. Scores go up, and so does confidence.',
    proof: 'Scores up 28% a month',
    tone: 'blue',
  },
]
</script>

<template>
  <section :style="{ background: 'linear-gradient(180deg, #FBF8FF 0%, #FFFFFF 100%)' }">
    <div class="mx-auto" style="max-width: 1180px; padding: 72px 22px">
      <SectionHeading
        center
        label="Why Hz Academy"
        title="Why parents trust us"
        sub="Not just another tuition class, a place where your child understands, feels confident, and enjoys learning."
        class="mb-11"
      />

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px">
        <div
          v-for="b in benefits"
          :key="b.title"
          :style="{
            background: '#fff',
            border: '1px solid var(--color-border-marketing)',
            borderRadius: '22px',
            padding: '26px',
            boxShadow: 'var(--shadow-card)',
          }"
        >
          <IconTile :icon="b.icon" :tone="b.tone" :size="52" :radius="16" />
          <h3 class="font-display font-semibold text-ink" style="font-size: 18px; margin: 16px 0 7px">
            {{ b.title }}
          </h3>
          <p style="font-size: 13.5px; color: var(--color-ink-soft); line-height: 1.55; margin: 0 0 18px">
            {{ b.desc }}
          </p>
          <span
            class="inline-flex items-center font-bold"
            :style="{ gap: '6px', padding: '7px 13px', borderRadius: '999px', fontSize: '12px', ...tonePair(b.tone) }"
          >
            ✓ {{ b.proof }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
