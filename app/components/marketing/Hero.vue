<script setup lang="ts">
import AppButton from '~/components/ui/AppButton.vue'
import { useSiteContent } from '~/composables/useSiteContent'
import { toneFg } from '~/utils/tone'

const { home } = useSiteContent()
const hero = home.hero
</script>

<template>
  <section class="relative isolate" :style="{ background: 'var(--hero-wash)' }">
    <HeroBackdrop />

    <div
      class="relative mx-auto grid gap-12 lg:grid-cols-[1.05fr_.95fr] items-center"
      style="max-width: 1120px; padding: 56px 22px 68px"
    >
      <!-- Centred while the columns are stacked. Left-aligned text under a
           centred headline reads as a layout that did not finish reflowing. -->
      <div class="text-center lg:text-left">
        <div class="flex flex-wrap gap-2.5 mb-6 justify-center lg:justify-start">
          <span
            v-for="pill in hero.pills"
            :key="pill.label"
            class="font-bold"
            :style="{
              padding: '7px 15px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '13px',
              background: pill.hot ? 'var(--color-tile-pink)' : 'var(--color-tile-violet)',
              color: pill.hot ? 'var(--color-fg-pink)' : 'var(--color-fg-violet)',
            }"
          >
            {{ pill.label }}
          </span>
        </div>

        <h1
          class="font-display font-semibold text-ink"
          style="font-size: clamp(2.05rem, 5vw, 3.5rem); line-height: 1.14; letter-spacing: -.01em"
        >
          {{ hero.headline }}<br >
          <span
            :style="{
              background: 'var(--hero-headline-gradient)',
              backgroundClip: 'text',
              color: 'transparent',
            }"
          >{{ hero.headlineAccent }}</span>
        </h1>

        <p
          class="text-text-body mx-auto lg:mx-0"
          style="font-size: 17.5px; line-height: 1.65; margin-top: 20px; margin-bottom: 28px; max-width: 30em"
        >
          {{ hero.lede }}
        </p>

        <div class="flex flex-wrap gap-3 justify-center lg:justify-start">
          <AppButton :to="hero.primary.to" variant="gradient" size="lg" pill>
            {{ hero.primary.label }}
          </AppButton>
          <AppButton :to="hero.secondary.to" variant="outline" size="lg" pill>
            {{ hero.secondary.label }}
          </AppButton>
        </div>

        <dl class="flex flex-wrap gap-7 mt-8 justify-center lg:justify-start">
          <div v-for="stat in hero.stats" :key="stat.label">
            <dt class="font-display font-semibold text-ink" style="font-size: 25px; line-height: 1.1">
              {{ stat.value }}
            </dt>
            <!-- ink-soft, not muted: muted clears 4.5:1 on neither the old wash
                 nor the pink one, and these sit directly on the field. -->
            <dd class="text-ink-soft" style="font-size: 13px">{{ stat.label }}</dd>
          </div>
        </dl>
      </div>

      <!-- Illustrative timetable, not seeded sessions. This is a marketing surface. -->
      <div
        :style="{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card-lg)',
          padding: '24px',
          boxShadow: 'var(--shadow-card-hover)',
        }"
      >
        <div class="flex items-center justify-between mb-1.5">
          <b class="text-ink" style="font-size: 15px">{{ hero.todayTitle }}</b>
          <span class="text-muted" style="font-size: 13px">{{ hero.todayDay }}</span>
        </div>
        <div
          v-for="(row, i) in hero.today"
          :key="row.time"
          class="flex items-center gap-3"
          :style="{
            padding: '13px 0',
            borderBottom: i === hero.today.length - 1 ? '0' : '1px solid var(--color-border)',
          }"
        >
          <span class="font-bold text-muted shrink-0" style="font-size: 12px; width: 52px">
            {{ row.time }}
          </span>
          <span
            :style="{
              width: '4px',
              alignSelf: 'stretch',
              borderRadius: 'var(--radius-pill)',
              background: toneFg(row.tone),
            }"
          />
          <span class="min-w-0">
            <b class="block text-ink truncate" style="font-size: 15px">{{ row.subject }}</b>
            <span class="block text-muted truncate" style="font-size: 12.5px">{{ row.meta }}</span>
          </span>
          <span
            v-if="row.live"
            class="ml-auto font-bold shrink-0"
            :style="{
              background: 'var(--color-tile-green)',
              color: 'var(--color-fg-green)',
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-pill)',
            }"
          >
            Langsung
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
