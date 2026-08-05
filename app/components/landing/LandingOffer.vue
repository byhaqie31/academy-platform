<script setup lang="ts">
import AppButton from '~/components/ui/AppButton.vue'
import { formatRM } from '~/utils/money'
import type { LandingCampaign } from '~/types'

// The dark band: strike-through price against the free trial. The scarcity line
// is generated from the campaign's own seat numbers, never hand-written, so it
// cannot drift from the counter in the hero.
const props = defineProps<{
  campaign: LandingCampaign
  seatsLeft: number
  copy: {
    title: string
    body: string
    freeLabel: string
    freeNote: string
    ctaLabel: string
    fineprint: string
  }
}>()

const offer = props.campaign.offer
</script>

<template>
  <section class="mx-auto" style="max-width: 1060px; padding: 0 22px 76px">
    <div
      class="grid gap-10 lg:grid-cols-[1.15fr_.85fr] items-center"
      :style="{
        background: 'var(--color-ink)',
        borderRadius: 'var(--radius-card-xl)',
        padding: 'clamp(30px, 5vw, 48px)',
      }"
    >
      <div>
        <span
          class="font-bold"
          :style="{
            fontSize: '12.5px',
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: 'var(--color-accent-pink)',
          }"
        >{{ campaign.pills[0] }}</span>

        <h2
          class="font-display font-semibold text-white"
          style="font-size: clamp(1.7rem, 3.4vw, 2.4rem); line-height: 1.15; margin: 12px 0 0"
        >
          {{ copy.title }}
        </h2>

        <p :style="{ fontSize: '16px', lineHeight: '1.65', marginTop: '14px', color: 'var(--color-footer-muted)' }">
          {{ copy.body }}
        </p>

        <p
          v-if="seatsLeft > 0"
          :style="{ fontSize: '15px', lineHeight: '1.6', marginTop: '14px', color: 'var(--color-footer-text)' }"
        >
          Ambilan ini ditutup apabila {{ offer.seatsTotal }} tempat penuh. Sekarang tinggal
          {{ seatsLeft }}.
        </p>
      </div>

      <div
        :style="{
          background: 'rgba(255,255,255,.06)',
          border: '1px solid var(--color-footer-line)',
          borderRadius: 'var(--radius-card)',
          padding: '28px',
          textAlign: 'center',
        }"
      >
        <div
          :style="{ color: 'var(--color-footer-faint)', fontSize: '17px', textDecoration: 'line-through' }"
        >
          {{ formatRM(offer.price) }}
        </div>
        <div class="font-display font-semibold text-white" style="font-size: 40px; line-height: 1.05; margin-top: 4px">
          {{ copy.freeLabel }}
        </div>
        <p :style="{ color: 'var(--color-footer-muted)', fontSize: '14.5px', marginTop: '8px' }">
          {{ copy.freeNote }}
        </p>

        <AppButton to="#daftar" variant="gradient" pill block class="mt-5">
          {{ copy.ctaLabel }}
        </AppButton>
        <p :style="{ color: 'var(--color-footer-faint)', fontSize: '13px', marginTop: '12px' }">
          {{ copy.fineprint }}
        </p>
      </div>
    </div>
  </section>
</template>
