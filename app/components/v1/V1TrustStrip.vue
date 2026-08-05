<!-- FROZEN ARCHIVE. Snapshot of the v1 marketing mockup, reachable only at /v1.
     Do not edit, restyle or translate. It exists to show what was built before the
     phase 1 website. Imports only ~/components/v1, ~/components/ui and ~/composables. -->

<script setup lang="ts">
// pure presentation copy, kept in-component
const bullets = ['Certified tutors', 'Small group classes', 'Organised notes & practice', 'Progress reports']
</script>

<template>
  <section :style="{ background: 'var(--color-ink)' }">
    <div
      class="mx-auto flex flex-wrap items-center justify-center text-white"
      style="max-width: 1180px; padding: 18px 22px; gap: 14px 34px"
    >
      <span class="font-display font-semibold" style="font-size: 14px; opacity: 0.7">
        Knowledge today, excellence tomorrow ✨
      </span>
      <span :style="{ width: '5px', height: '5px', borderRadius: '50%', background: '#FF7AA8' }" />
      <span v-for="b in bullets" :key="b" style="font-size: 13.5px; font-weight: 600; opacity: 0.85">{{ b }}</span>
    </div>
  </section>
</template>
