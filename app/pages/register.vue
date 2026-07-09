<script setup lang="ts">
import RegistrationWizard from '~/components/marketing/RegistrationWizard.vue'

definePageMeta({ layout: 'marketing' })
</script>

<template>
  <section class="mx-auto" style="max-width: 760px; padding: 54px 22px">
    <div style="text-align: center; margin-bottom: 30px">
      <h1 class="font-display font-bold text-ink" style="font-size: clamp(1.8rem, 3.6vw, 2.5rem); margin: 0 0 8px">
        Register your child's interest
      </h1>
      <p style="font-size: 15px; color: var(--color-ink-soft); margin: 0">
        Simple, quick, and pressure-free, we'll take care of the rest.
      </p>
    </div>

    <RegistrationWizard />
  </section>
</template>
