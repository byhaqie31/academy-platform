<script setup lang="ts">
import { computed, ref } from 'vue'
import LogoMark from '~/components/ui/LogoMark.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { useAcademy } from '~/composables/useAcademy'
import { isValidMyPhone } from '~/utils/validation'

// No auth library, no request, no session. Phase 1 is a static marketing build;
// this page exists so the portal has an address, not so it has a login.
definePageMeta({ layout: 'portal-auth' })

const { academy } = useAcademy()

const phone = ref('')
const sent = ref(false)
const canSend = computed(() => isValidMyPhone(phone.value))

useHead({ title: `Log masuk portal · ${academy.name}` })
</script>

<template>
  <div
    :style="{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-card)',
      padding: '34px 30px',
      boxShadow: 'var(--shadow-card)',
    }"
  >
    <div class="flex items-center gap-3 mb-7">
      <LogoMark :size="40" />
      <span class="font-display font-bold text-ink" style="font-size: 18px">{{ academy.name }}</span>
    </div>

    <template v-if="sent">
      <h1 class="font-display font-semibold text-ink" style="font-size: 22px; line-height: 1.25">
        Pautan dihantar
      </h1>
      <p class="text-muted" style="font-size: 15px; line-height: 1.65; margin-top: 10px">
        Semak WhatsApp anda. Pautan log masuk sah selama 15 minit.
      </p>
    </template>

    <form v-else novalidate @submit.prevent="sent = true">
      <h1 class="font-display font-semibold text-ink" style="font-size: 22px; line-height: 1.25">
        Log masuk portal ibu bapa
      </h1>
      <p class="text-muted" style="font-size: 15px; line-height: 1.65; margin: 10px 0 24px">
        Masukkan nombor telefon yang anda daftarkan dengan kami. Kami hantar pautan log masuk ke
        WhatsApp anda, jadi tiada kata laluan untuk diingat.
      </p>

      <label for="portal-phone" class="block text-ink font-bold" style="font-size: 14px; margin-bottom: 6px">
        No. telefon (WhatsApp)
      </label>
      <input
        id="portal-phone"
        v-model="phone"
        type="tel"
        placeholder="Cth: 012-345 6789"
        :style="{
          width: '100%',
          padding: '13px 16px',
          border: '1.5px solid var(--color-border-input)',
          borderRadius: 'var(--radius-input)',
          fontSize: '15.5px',
          color: 'var(--color-ink)',
          background: 'var(--color-surface)',
          marginBottom: '18px',
        }"
      >

      <AppButton type="submit" variant="gradient" size="lg" pill block :disabled="!canSend">
        Hantar pautan ke WhatsApp
      </AppButton>
    </form>

    <NuxtLink
      to="/"
      class="block text-center no-underline text-muted hover:text-brand-deep transition-colors"
      style="font-size: 13.5px; margin-top: 22px"
    >
      Kembali ke laman utama
    </NuxtLink>
  </div>
</template>
