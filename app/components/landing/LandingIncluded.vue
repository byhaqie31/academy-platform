<script setup lang="ts">
import AppButton from '~/components/ui/AppButton.vue'
import type { SiteSection } from '~/types'

// Checklist beside a repeated call to action. Same CTA wording as everywhere
// else on the page, on purpose.
defineProps<{ section: SiteSection, items: string[], ctaLabel: string }>()
</script>

<template>
  <section class="mx-auto" style="max-width: 1060px; padding: 76px 22px">
    <div class="grid gap-12 lg:grid-cols-2 items-center">
      <div>
        <span
          class="font-bold"
          :style="{
            fontSize: '12.5px',
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: 'var(--color-brand)',
          }"
        >{{ section.eyebrow }}</span>

        <h2
          class="font-display font-semibold text-ink"
          style="font-size: clamp(1.6rem, 3.2vw, 2.2rem); line-height: 1.15; margin: 12px 0 0"
        >
          {{ section.title }}
        </h2>

        <p class="text-muted" style="font-size: 17px; line-height: 1.65; margin-top: 16px">
          {{ section.lede }}
        </p>

        <AppButton to="#daftar" variant="gradient" size="lg" pill class="mt-7">
          {{ ctaLabel }}
        </AppButton>
      </div>

      <div
        :style="{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
          padding: '30px',
          boxShadow: 'var(--shadow-card)',
        }"
      >
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 4px 20px">
          <div
            v-for="item in items"
            :key="item"
            class="relative text-text-body"
            style="padding-left: 27px; padding-top: 7px; padding-bottom: 7px; font-size: 14.5px; line-height: 1.5"
          >
            <span
              aria-hidden="true"
              class="absolute grid place-items-center font-bold text-white"
              :style="{
                left: '0',
                top: '9px',
                width: '19px',
                height: '19px',
                borderRadius: '50%',
                background: 'var(--brand-gradient-pp)',
                fontSize: '10.5px',
              }"
            >✓</span>
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
