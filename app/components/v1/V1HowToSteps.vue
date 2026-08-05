<!-- FROZEN ARCHIVE. Snapshot of the v1 marketing mockup, reachable only at /v1.
     Do not edit, restyle or translate. It exists to show what was built before the
     phase 1 website. Imports only ~/components/v1, ~/components/ui and ~/composables. -->

<script setup lang="ts">
import SectionHeading from '~/components/ui/SectionHeading.vue'

// pure presentation content from the prototype "How to register" section
const steps = [
  { num: 1, title: 'Register interest', desc: 'Fill in a short form in under 3 minutes.', tile: '#8B6CF0' },
  { num: 2, title: 'We reach out', desc: 'Our team WhatsApps you to confirm the details.', tile: '#FF7AA8' },
  { num: 3, title: 'Pick a schedule', desc: 'Set the branch, subjects, and time that suit you.', tile: '#3DA5F4' },
  { num: 4, title: 'Start learning', desc: 'Your child joins class and starts thriving!', tile: '#34C77B' },
]
</script>

<template>
  <section :style="{ background: 'linear-gradient(180deg, #FFFFFF, #FBF8FF)', marginTop: '48px' }">
    <div class="mx-auto" style="max-width: 1180px; padding: 72px 22px">
      <SectionHeading
        center
        label="How to register"
        title="Register your child's interest, made easy"
        sub="Four simple steps, done in under 3 minutes."
        class="mb-11"
      />

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px">
        <div
          v-for="s in steps"
          :key="s.num"
          :style="{
            background: '#fff',
            border: '1px solid var(--color-border-marketing)',
            borderRadius: '22px',
            padding: '24px',
            boxShadow: 'var(--shadow-card)',
            position: 'relative',
          }"
        >
          <div
            class="grid place-items-center font-display font-bold text-white"
            :style="{ width: '46px', height: '46px', borderRadius: '14px', fontSize: '20px', background: s.tile, marginBottom: '16px' }"
          >
            {{ s.num }}
          </div>
          <h3 class="font-display font-semibold text-ink" style="font-size: 17px; margin: 0 0 7px">{{ s.title }}</h3>
          <p style="font-size: 13.5px; color: var(--color-ink-soft); line-height: 1.5; margin: 0">{{ s.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
