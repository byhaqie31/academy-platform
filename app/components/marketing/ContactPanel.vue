<script setup lang="ts">
import AppButton from '~/components/ui/AppButton.vue'
import { useAcademy } from '~/composables/useAcademy'
import { useSiteContent } from '~/composables/useSiteContent'

// WhatsApp first, everything else second. The number and the address come from
// config/academy.ts, never from this component.
const { academy } = useAcademy()
const { contact } = useSiteContent()

const wa = `https://wa.me/${academy.contact.whatsapp}?text=${encodeURIComponent(contact.whatsAppMessage)}`
</script>

<template>
  <div>
    <span class="font-bold" :style="{ fontSize: '12.5px', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--color-brand)' }">
      {{ contact.section.eyebrow }}
    </span>
    <h1
      class="font-display font-semibold text-ink"
      style="font-size: clamp(1.75rem, 3.4vw, 2.4rem); line-height: 1.14; margin: 13px 0 0"
    >
      {{ contact.section.title }}
    </h1>
    <p class="text-muted" style="font-size: 17px; line-height: 1.65; margin-top: 16px; max-width: 32em">
      {{ contact.section.lede }}
    </p>

    <AppButton :to="wa" variant="whatsapp" size="lg" pill class="mt-6">
      <span aria-hidden="true">💬</span> WhatsApp kami sekarang
    </AppButton>

    <div style="margin-top: 40px">
      <h2 class="font-display font-semibold text-ink" style="font-size: 18px; margin-bottom: 12px">
        Waktu pejabat
      </h2>
      <p v-for="line in contact.officeHours" :key="line" class="text-muted" style="font-size: 15.5px; line-height: 1.7">
        {{ line }}
      </p>

      <h2 class="font-display font-semibold text-ink" style="font-size: 18px; margin: 26px 0 12px">
        E-mel
      </h2>
      <a
        :href="`mailto:${academy.contact.email}`"
        class="text-muted no-underline hover:text-brand-deep transition-colors"
        style="font-size: 15.5px"
      >
        {{ academy.contact.email }}
      </a>
    </div>
  </div>
</template>
