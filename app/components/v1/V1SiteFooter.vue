<!-- FROZEN ARCHIVE. Snapshot of the v1 marketing mockup, reachable only at /v1.
     Do not edit, restyle or translate. It exists to show what was built before the
     phase 1 website. Imports only ~/components/v1, ~/components/ui and ~/composables. -->

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
          Learn with confidence. Trusted tuition since {{ academy.since }}, with
          {{ branches.length }} branches across Selangor and Pahang.
        </p>
      </div>

      <div>
        <div class="font-display font-semibold mb-4" style="font-size: 14px">Academy</div>
        <div class="flex flex-col gap-2.5" style="font-size: 13px; color: #9ca0be">
          <NuxtLink to="/" class="no-underline" style="color: #9ca0be">Home</NuxtLink>
          <NuxtLink to="/register" class="no-underline" style="color: #9ca0be">Register interest</NuxtLink>
          <NuxtLink to="/portal/parents" class="no-underline" style="color: #9ca0be">Parent portal</NuxtLink>
        </div>
      </div>

      <div>
        <div class="font-display font-semibold mb-4" style="font-size: 14px">Branches</div>
        <div class="flex flex-col gap-2.5" style="font-size: 13px; color: #9ca0be">
          <span v-for="b in branches" :key="b.id">{{ b.name }}</span>
        </div>
      </div>

      <div>
        <div class="font-display font-semibold mb-4" style="font-size: 14px">Contact</div>
        <div class="flex flex-col gap-2.5" style="font-size: 13px; color: #9ca0be">
          <span>📞 {{ academy.contact.phone }}</span>
          <span>✉️ {{ academy.contact.email }}</span>
          <a :href="`https://wa.me/${academy.contact.whatsapp}`" class="no-underline" style="color: #34c77b">
            💬 WhatsApp us
          </a>
        </div>
      </div>
    </div>
    <div
      class="mx-auto flex flex-wrap items-center justify-between gap-3"
      style="max-width: 1180px; padding: 18px 22px; border-top: 1px solid rgba(255,255,255,.08); font-size: 12px; color: #6f739a"
    >
      <span>© {{ academy.since }} to 2026 {{ academy.name }}. {{ academy.motto }}</span>
      <span>Privacy · Terms</span>
    </div>
  </footer>
</template>
