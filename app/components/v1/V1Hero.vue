<!-- FROZEN ARCHIVE. Snapshot of the v1 marketing mockup, reachable only at /v1.
     Do not edit, restyle or translate. It exists to show what was built before the
     phase 1 website. Imports only ~/components/v1, ~/components/ui and ~/composables. -->

<script setup lang="ts">
import AppButton from '~/components/ui/AppButton.vue'
import { useAcademy } from '~/composables/useAcademy'

const { academy } = useAcademy()
const wa = `https://wa.me/${academy.contact.whatsapp}`

// pure presentation content (badges + stats), kept in-component like SiteFooter copy
const badges = [
  { icon: '⭐', text: 'Trusted since 2014', bg: '#FFF4D6', color: '#9A6B00' },
  { icon: '📍', text: '4 branches', bg: '#EAF3FF', color: '#1F6FB8' },
  { icon: '🎓', text: 'Tahun 1 to Tingkatan 5', bg: '#F1ECFF', color: '#6B4BD6' },
]
const stats = [
  { value: '1,000+', label: 'Students mentored' },
  { value: '50+', label: 'Experienced tutors' },
  { value: '10 yrs', label: 'Trusted track record' },
]
</script>

<template>
  <section class="relative overflow-hidden" :style="{ background: 'linear-gradient(180deg, #FBF8FF 0%, #FFFFFF 100%)' }">
    <div :style="{ position: 'absolute', top: '-90px', right: '-60px', width: '340px', height: '340px', borderRadius: '50%', background: 'radial-gradient(circle, #FFE0EC, transparent 70%)' }" />
    <div :style="{ position: 'absolute', bottom: '-120px', left: '-80px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, #E3F6EC, transparent 70%)' }" />

    <div
      class="relative mx-auto flex flex-wrap items-center"
      style="max-width: 1180px; padding: 54px 22px 64px; gap: 48px"
    >
      <!-- LEFT -->
      <div style="flex: 1 1 420px; min-width: 300px">
        <div class="flex flex-wrap" style="gap: 8px; margin-bottom: 22px">
          <span
            v-for="b in badges"
            :key="b.text"
            class="inline-flex items-center font-bold"
            :style="{ gap: '6px', padding: '7px 13px', borderRadius: '999px', background: b.bg, color: b.color, fontSize: '12.5px' }"
          >
            {{ b.icon }} {{ b.text }}
          </span>
        </div>

        <h1
          class="font-display font-bold text-ink"
          style="font-size: clamp(2.3rem, 5vw, 3.7rem); line-height: 1.06; letter-spacing: -0.01em; margin: 0 0 18px; text-wrap: balance"
        >
          Learning made fun,<br>
          <span :style="{ background: 'var(--brand-gradient)', '-webkit-background-clip': 'text', backgroundClip: 'text', color: 'transparent' }">
            future made bright
          </span>
        </h1>

        <p style="font-size: clamp(15px, 1.6vw, 18px); line-height: 1.6; color: var(--color-ink-soft); max-width: 520px; margin: 0 0 30px">
          {{ academy.name }}'s digital platform for student registration, class info, and parent enquiries, all in one place.
        </p>

        <div class="flex flex-wrap items-center" style="gap: 13px">
          <AppButton to="/register" variant="gradient">Register interest now →</AppButton>
          <AppButton :to="wa" variant="outline">💬 WhatsApp us</AppButton>
        </div>

        <div class="flex flex-wrap" style="gap: 26px; margin-top: 34px">
          <div v-for="s in stats" :key="s.label">
            <div class="font-display font-bold text-ink" style="font-size: 26px">{{ s.value }}</div>
            <div style="font-size: 12.5px; color: var(--color-muted); font-weight: 600">{{ s.label }}</div>
          </div>
        </div>
      </div>

      <!-- RIGHT -->
      <div style="flex: 1 1 380px; min-width: 300px; position: relative">
        <div
          class="hz-pop grid place-items-center text-center"
          :style="{
            position: 'relative',
            borderRadius: '30px',
            overflow: 'hidden',
            background: 'var(--dashed-stripes)',
            border: '2px dashed var(--color-dashed)',
            minHeight: '380px',
          }"
        >
          <div style="font-family: ui-monospace, monospace; font-size: 12.5px; color: #8e7bd6; padding: 20px">
            [ hero illustration ]<br>
            <span style="opacity: 0.7">cheerful student · books · stars</span>
          </div>
        </div>

        <div
          class="hz-float"
          :style="{ position: 'absolute', top: '-18px', left: '-14px', background: '#fff', borderRadius: '18px', padding: '13px 16px', boxShadow: '0 14px 30px rgba(30,35,72,.12)' }"
        >
          <div class="flex items-center" style="gap: 9px">
            <div class="grid place-items-center" :style="{ width: '34px', height: '34px', borderRadius: '11px', background: 'var(--color-tile-green)', fontSize: '17px' }">📈</div>
            <div>
              <div class="font-bold text-ink" style="font-size: 13px">Scores up 28%</div>
              <div style="font-size: 11px; color: var(--color-muted); font-weight: 600">average per month</div>
            </div>
          </div>
        </div>

        <div
          class="hz-float2"
          :style="{ position: 'absolute', bottom: '-16px', right: '-10px', background: '#fff', borderRadius: '18px', padding: '13px 16px', boxShadow: '0 14px 30px rgba(30,35,72,.12)' }"
        >
          <div class="flex items-center" style="gap: 9px">
            <div class="grid place-items-center" :style="{ width: '34px', height: '34px', borderRadius: '11px', background: 'var(--color-tile-amber)', fontSize: '17px' }">🏅</div>
            <div>
              <div class="font-bold text-ink" style="font-size: 13px">Classes full of fun</div>
              <div style="font-size: 11px; color: var(--color-muted); font-weight: 600">learning without stress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
