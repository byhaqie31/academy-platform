<script setup lang="ts">
import { useEducators } from '~/composables/useEducators'
import { toneFg } from '~/utils/tone'

// publicProfiles, never `all`. Hourly rate and accumulated hours are payroll
// fields and must not reach a public page.
const { publicProfiles } = useEducators()
const tutors = publicProfiles()
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px">
    <article
      v-for="t in tutors"
      :key="t.id"
      class="text-center"
      :style="{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-card)',
        padding: '24px',
        boxShadow: 'var(--shadow-card)',
      }"
    >
      <span
        aria-hidden="true"
        class="grid place-items-center font-display font-semibold text-white"
        :style="{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          margin: '0 auto 15px',
          fontSize: '26px',
          background: toneFg(t.tone),
        }"
      >
        {{ t.initial }}
      </span>
      <b class="block font-display font-semibold text-ink" style="font-size: 17px">{{ t.name }}</b>
      <span class="block font-bold" :style="{ fontSize: '13.5px', marginTop: '3px', color: 'var(--color-brand)' }">
        {{ t.subjects }}
      </span>
      <p class="text-muted" style="font-size: 14px; line-height: 1.6; margin-top: 9px">
        {{ t.years }} tahun mengajar. {{ t.bio }}
      </p>
    </article>
  </div>
</template>
