<script setup lang="ts">
import AppButton from '~/components/ui/AppButton.vue'
import { useSiteContent } from '~/composables/useSiteContent'

const { home } = useSiteContent()
const cta = home.cta
</script>

<template>
  <section class="mx-auto" style="max-width: 1120px; padding: 0 22px 76px">
    <div
      class="relative overflow-hidden text-center"
      :style="{
        background: 'var(--color-ink)',
        borderRadius: 'var(--radius-card-xl)',
        padding: 'clamp(32px, 5vw, 50px)',
      }"
    >
      <div
        aria-hidden="true"
        :style="{
          position: 'absolute',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          right: '-120px',
          top: '-180px',
          background: 'radial-gradient(circle, rgba(139,108,240,.5), rgba(30,35,72,0) 68%)',
        }"
      />
      <div class="relative">
        <h2
          class="font-display font-semibold text-white"
          style="font-size: clamp(1.7rem, 3.4vw, 2.4rem); line-height: 1.14; margin: 0"
        >
          {{ cta.title }}
        </h2>
        <p
          class="mx-auto"
          :style="{ fontSize: '16.5px', lineHeight: '1.65', margin: '14px auto 26px', maxWidth: '34em', color: 'var(--color-footer-muted)' }"
        >
          {{ cta.body }}
        </p>
        <AppButton :to="cta.cta.to" variant="gradient" size="lg" pill>
          {{ cta.cta.label }}
        </AppButton>
      </div>
    </div>
  </section>
</template>
