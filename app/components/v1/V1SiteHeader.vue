<!-- FROZEN ARCHIVE. Snapshot of the v1 marketing mockup, reachable only at /v1.
     Do not edit, restyle or translate. It exists to show what was built before the
     phase 1 website. Imports only ~/components/v1, ~/components/ui and ~/composables. -->

<script setup lang="ts">
import LogoMark from '~/components/ui/LogoMark.vue'
import AppButton from '~/components/ui/AppButton.vue'
import LoginDropdown from './V1LoginDropdown.vue'
import { useAcademy } from '~/composables/useAcademy'

const { academy } = useAcademy()
const wa = `https://wa.me/${academy.contact.whatsapp}`
</script>

<template>
  <header
    class="sticky top-0 z-40"
    :style="{
      background: 'rgba(255,255,255,.86)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--color-border-marketing)',
    }"
  >
    <div
      class="mx-auto flex items-center gap-4"
      style="max-width: 1180px; padding: 13px 22px"
    >
      <NuxtLink to="/" class="flex items-center gap-3 no-underline">
        <LogoMark :size="38" />
        <span class="font-display font-bold text-ink" style="font-size: 18px">{{ academy.name }}</span>
      </NuxtLink>

      <nav class="ml-6 hidden md:flex items-center gap-1">
        <NuxtLink
          to="/"
          class="no-underline font-bold text-ink-soft transition-colors hover:text-ink"
          :style="{ padding: '8px 14px', borderRadius: '999px', fontSize: '13.5px' }"
        >
          Home
        </NuxtLink>
        <NuxtLink
          to="/register"
          class="no-underline font-bold text-ink-soft transition-colors hover:text-ink"
          :style="{ padding: '8px 14px', borderRadius: '999px', fontSize: '13.5px' }"
        >
          Register interest
        </NuxtLink>
      </nav>

      <div class="ml-auto flex items-center gap-2.5">
        <LoginDropdown />
        <AppButton :to="wa" variant="whatsapp" size="sm" class="hidden sm:inline-flex">
          💬 WhatsApp us
        </AppButton>
      </div>
    </div>
  </header>
</template>
