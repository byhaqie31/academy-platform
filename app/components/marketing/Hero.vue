<script setup lang="ts">
import AppButton from '~/components/ui/AppButton.vue'
import { useAcademy } from '~/composables/useAcademy'

const { academy } = useAcademy()
const wa = `https://wa.me/${academy.contact.whatsapp}`

// pure presentation content (badges + stats), kept in-component like SiteFooter copy
const badges = [
  { icon: '⭐', text: 'Dipercayai sejak 2014', bg: '#FFF4D6', color: '#9A6B00' },
  { icon: '📍', text: '4 Cawangan', bg: '#EAF3FF', color: '#1F6FB8' },
  { icon: '🎓', text: 'Tahun 1 – Tingkatan 5', bg: '#F1ECFF', color: '#6B4BD6' },
]
const stats = [
  { value: '1,000+', label: 'Pelajar dibimbing' },
  { value: '50+', label: 'Guru berpengalaman' },
  { value: '10 thn', label: 'Pengalaman dipercayai' },
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
          Belajar Lebih Seronok,<br>
          <span :style="{ background: 'var(--brand-gradient)', '-webkit-background-clip': 'text', backgroundClip: 'text', color: 'transparent' }">
            Masa Depan Lebih Cerah
          </span>
        </h1>

        <p style="font-size: clamp(15px, 1.6vw, 18px); line-height: 1.6; color: var(--color-ink-soft); max-width: 520px; margin: 0 0 30px">
          Platform digital {{ academy.name }} untuk pendaftaran pelajar, maklumat kelas, dan enquiry ibu bapa, semua dalam satu tempat.
        </p>

        <div class="flex flex-wrap items-center" style="gap: 13px">
          <AppButton to="/register" variant="gradient">Daftar Minat Sekarang →</AppButton>
          <AppButton :to="wa" variant="outline">💬 WhatsApp Kami</AppButton>
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
            <span style="opacity: 0.7">pelajar ceria · buku · bintang</span>
          </div>
        </div>

        <div
          class="hz-float"
          :style="{ position: 'absolute', top: '-18px', left: '-14px', background: '#fff', borderRadius: '18px', padding: '13px 16px', boxShadow: '0 14px 30px rgba(30,35,72,.12)' }"
        >
          <div class="flex items-center" style="gap: 9px">
            <div class="grid place-items-center" :style="{ width: '34px', height: '34px', borderRadius: '11px', background: 'var(--color-tile-green)', fontSize: '17px' }">📈</div>
            <div>
              <div class="font-bold text-ink" style="font-size: 13px">Markah naik 28%</div>
              <div style="font-size: 11px; color: var(--color-muted); font-weight: 600">purata sebulan</div>
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
              <div class="font-bold text-ink" style="font-size: 13px">Kelas penuh seronok</div>
              <div style="font-size: 11px; color: var(--color-muted); font-weight: 600">belajar tanpa stress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
