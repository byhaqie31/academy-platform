<script setup lang="ts">
import { useAcademy } from '~/composables/useAcademy'

const { academy } = useAcademy()
const wa = `https://wa.me/${academy.contact.whatsapp}`
</script>

<template>
  <section class="mx-auto" style="max-width: 1180px; padding: 64px 22px">
    <div
      class="relative overflow-hidden text-center"
      :style="{ background: 'var(--brand-gradient)', borderRadius: '30px', padding: 'clamp(34px, 5vw, 58px)' }"
    >
      <div :style="{ position: 'absolute', top: '-40px', left: '-30px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,.14)' }" />
      <div :style="{ position: 'absolute', bottom: '-50px', right: '-20px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,.12)' }" />

      <div class="relative">
        <h2 class="font-display font-bold" style="font-size: clamp(1.9rem, 4vw, 3rem); color: #fff; margin: 0 0 14px; line-height: 1.08">
          Satu langkah lebih dekat ke kejayaan
        </h2>
        <p class="mx-auto" style="font-size: 17px; color: rgba(255,255,255,.92); margin: 0 0 28px; max-width: 520px">
          Daftar minat anak anda hari ini. Admin {{ academy.name }} akan hubungi anda melalui WhatsApp.
        </p>
        <div class="flex flex-wrap justify-center" style="gap: 13px">
          <NuxtLink
            to="/daftar"
            class="inline-flex items-center justify-center no-underline transition-transform duration-150 hover:-translate-y-px"
            :style="{ padding: '16px 30px', borderRadius: '999px', background: '#fff', color: '#7A4FE0', fontWeight: '800', fontSize: '15.5px', boxShadow: '0 10px 24px rgba(0,0,0,.16)' }"
          >
            Daftar Minat Sekarang
          </NuxtLink>
          <NuxtLink
            :to="wa"
            class="inline-flex items-center justify-center no-underline transition-transform duration-150 hover:-translate-y-px"
            :style="{ gap: '8px', padding: '16px 26px', borderRadius: '999px', background: 'rgba(255,255,255,.16)', border: '2px solid rgba(255,255,255,.5)', color: '#fff', fontWeight: '700', fontSize: '15px' }"
          >
            <span style="font-size: 17px">💬</span> WhatsApp Kami
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
