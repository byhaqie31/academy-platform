<script setup lang="ts">
import LogoMark from '~/components/ui/LogoMark.vue'
import { useAcademy } from '~/composables/useAcademy'

const { academy, branches } = useAcademy()
</script>

<template>
  <footer :style="{ background: 'var(--color-ink-footer)' }" class="text-white">
    <div
      class="mx-auto grid gap-10 md:grid-cols-4"
      style="max-width: 1180px; padding: 54px 22px 30px"
    >
      <div>
        <div class="flex items-center gap-3 mb-4">
          <LogoMark :size="38" />
          <span class="font-display font-bold" style="font-size: 18px">{{ academy.name }}</span>
        </div>
        <p style="font-size: 13px; color: #9ca0be; line-height: 1.6; max-width: 260px">
          Belajar dengan yakin. Tuisyen dipercayai sejak {{ academy.since }} dengan
          {{ branches.length }} cawangan di seluruh Selangor & Pahang.
        </p>
      </div>

      <div>
        <div class="font-display font-semibold mb-4" style="font-size: 14px">Akademi</div>
        <div class="flex flex-col gap-2.5" style="font-size: 13px; color: #9ca0be">
          <NuxtLink to="/" class="no-underline" style="color: #9ca0be">Utama</NuxtLink>
          <NuxtLink to="/daftar" class="no-underline" style="color: #9ca0be">Daftar Minat</NuxtLink>
          <NuxtLink to="/portal/ibubapa" class="no-underline" style="color: #9ca0be">Portal Ibu Bapa</NuxtLink>
        </div>
      </div>

      <div>
        <div class="font-display font-semibold mb-4" style="font-size: 14px">Cawangan</div>
        <div class="flex flex-col gap-2.5" style="font-size: 13px; color: #9ca0be">
          <span v-for="b in branches" :key="b.id">{{ b.name }}</span>
        </div>
      </div>

      <div>
        <div class="font-display font-semibold mb-4" style="font-size: 14px">Hubungi</div>
        <div class="flex flex-col gap-2.5" style="font-size: 13px; color: #9ca0be">
          <span>📞 {{ academy.contact.phone }}</span>
          <span>✉️ {{ academy.contact.email }}</span>
          <a :href="`https://wa.me/${academy.contact.whatsapp}`" class="no-underline" style="color: #34c77b">
            💬 WhatsApp Kami
          </a>
        </div>
      </div>
    </div>
    <div
      class="mx-auto flex flex-wrap items-center justify-between gap-3"
      style="max-width: 1180px; padding: 18px 22px; border-top: 1px solid rgba(255,255,255,.08); font-size: 12px; color: #6f739a"
    >
      <span>© {{ academy.since }} to 2026 {{ academy.name }}. {{ academy.motto }}</span>
      <span>Privasi · Terma</span>
    </div>
  </footer>
</template>
