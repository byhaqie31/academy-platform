<script setup lang="ts">
import AppButton from '~/components/ui/AppButton.vue'
import CheckList from '~/components/marketing/CheckList.vue'
import LogoMark from '~/components/ui/LogoMark.vue'
import { useAcademy } from '~/composables/useAcademy'
import { useSiteNav } from '~/composables/useSiteNav'
import { formatRM } from '~/utils/money'
import type { LandingCampaign, LandingStat } from '~/types'

const props = defineProps<{
  campaign: LandingCampaign
  stats: LandingStat[]
  seatsPct: number
  seatsLabel: string
  waHref: string
}>()

// The brand mark lives in the hero, not the layout, so it sits on the wash and
// the page opens as one block. Deliberately not a link: see layouts/landing.vue.
const { academy } = useAcademy()
const { brandSub } = useSiteNav()

const offer = props.campaign.offer
</script>

<template>
  <section :style="{ background: 'var(--hero-wash)' }">
    <div class="mx-auto" style="max-width: 1060px; padding: 20px 22px 68px">
      <div class="landing-hero__brand flex items-center gap-3" style="margin-bottom: 30px">
        <LogoMark :size="40" />
        <span>
          <span class="block font-display font-bold text-ink" style="font-size: 18px">
            {{ academy.name }}
          </span>
          <span
            class="block text-muted font-bold"
            style="font-size: 10px; letter-spacing: .16em; text-transform: uppercase; margin-top: -2px"
          >
            {{ brandSub }}
          </span>
        </span>
      </div>

      <div class="grid gap-12 lg:grid-cols-[1.05fr_.95fr] items-start">
        <div class="landing-hero__copy">
          <div class="landing-hero__pills flex flex-wrap gap-2.5 mb-6">
            <span
              v-for="(pill, i) in campaign.pills"
              :key="pill"
              class="font-bold"
              :style="{
                padding: '7px 15px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '13px',
                background: i === 0 ? 'var(--color-tile-pink)' : 'var(--color-tile-violet)',
                color: i === 0 ? 'var(--color-fg-pink)' : 'var(--color-fg-violet)',
              }"
            >{{ pill }}</span>
          </div>

          <h1
            class="font-display font-semibold text-ink"
            style="font-size: clamp(2rem, 5vw, 3.3rem); line-height: 1.14; letter-spacing: -.01em"
          >
            {{ campaign.headline }}<br >
            <span
              :style="{ background: 'var(--headline-gradient)', backgroundClip: 'text', color: 'transparent' }"
            >{{ campaign.headlineAccent }}</span>
          </h1>

          <!-- Horizontal margin is left unset so the centred mobile layout can
               claim it with `auto`. An inline `margin: x 0 y` would win. -->
          <p
            class="landing-hero__sub text-text-body"
            style="font-size: 17.5px; line-height: 1.65; margin-top: 20px; margin-bottom: 28px; max-width: 32em"
          >
            {{ campaign.subheadline }}
          </p>

          <div class="landing-hero__ctas flex flex-wrap gap-3">
            <AppButton to="#daftar" variant="gradient" size="lg" pill>
              {{ campaign.cta.label }}
            </AppButton>
            <AppButton :to="waHref" variant="whatsapp" size="lg" pill>
              WhatsApp kami
            </AppButton>
          </div>

          <dl class="landing-hero__stats flex flex-wrap gap-7 mt-8">
            <div v-for="stat in stats" :key="stat.label">
              <dt class="font-display font-semibold text-ink" style="font-size: 25px; line-height: 1.1">
                {{ stat.value }}
              </dt>
              <dd class="text-muted" style="font-size: 13px">{{ stat.label }}</dd>
            </div>
          </dl>
        </div>

        <!-- The offer, repeated here so the price is visible without scrolling. -->
        <div
          :style="{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card-lg)',
            padding: '26px',
            boxShadow: 'var(--shadow-card-hover)',
          }"
        >
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              class="font-bold"
              :style="{
                padding: '5px 12px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '12px',
                background: 'var(--color-tile-violet)',
                color: 'var(--color-fg-violet)',
              }"
            >{{ offer.tag }}</span>
            <span
              class="font-bold"
              :style="{
                padding: '5px 12px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '12px',
                background: 'var(--color-tile-green)',
                color: 'var(--color-fg-green)',
              }"
            >{{ offer.trial.label }}</span>
          </div>

          <div class="font-display font-semibold text-ink" style="font-size: 40px; line-height: 1.05">
            {{ formatRM(offer.price) }}
            <small class="text-muted" style="font-size: 16px; font-weight: 600">/ {{ offer.period }}</small>
          </div>
          <p class="text-muted" style="font-size: 14.5px; margin: 6px 0 18px">{{ offer.schedule }}</p>

          <CheckList :items="offer.includes" />

          <div style="margin-top: 20px">
            <div class="flex justify-between" style="font-size: 13.5px">
              <span class="text-muted">{{ seatsLabel }}</span>
              <b class="text-ink">{{ offer.seatsTaken }} daripada {{ offer.seatsTotal }} penuh</b>
            </div>
            <div
              :style="{
                height: '7px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--color-tile-violet)',
                marginTop: '8px',
                overflow: 'hidden',
              }"
            >
              <span
                class="block h-full"
                :style="{ width: `${seatsPct}%`, background: 'var(--brand-gradient-pp)' }"
              />
            </div>
          </div>

          <AppButton to="#daftar" variant="gradient" pill block class="mt-5">
            {{ campaign.cta.label }}
          </AppButton>
          <p class="text-muted text-center" style="font-size: 13px; margin-top: 12px">
            {{ offer.trial.note }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Below lg the hero reads as one centred column, so the mark sits on the same
   axis as the copy instead of off to one side. The offer card keeps its own
   left-aligned internals: a centred checklist is measurably harder to scan. */
@media (width < 64rem) {
  .landing-hero__brand {
    justify-content: center;
  }

  .landing-hero__copy {
    text-align: center;
  }

  .landing-hero__pills,
  .landing-hero__ctas,
  .landing-hero__stats {
    justify-content: center;
  }

  .landing-hero__sub {
    margin-inline: auto;
  }
}
</style>
