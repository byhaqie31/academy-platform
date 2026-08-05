<script setup lang="ts">
import LogoMark from '~/components/ui/LogoMark.vue'
import { useAcademy } from '~/composables/useAcademy'
import { useSiteNav } from '~/composables/useSiteNav'

// The portal link lives here and only here. Keeping it out of the header is the
// point: phase 1 is a marketing build, the portal is a phase 2 product that
// happens to have a door on the same domain.
const { academy } = useAcademy()
const { cta, brandSub, footerColumns, footerBlurb, portalLink } = useSiteNav()

// Contact links are built from config/academy.ts, never seeded twice.
const wa = `https://wa.me/${academy.contact.whatsapp}`
const mail = `mailto:${academy.contact.email}`
</script>

<template>
  <footer
    :style="{ background: 'var(--color-ink-footer)', color: 'var(--color-footer-text)' }"
  >
    <div
      class="mx-auto grid gap-9 sm:grid-cols-2 lg:grid-cols-4"
      style="max-width: 1120px; padding: 54px 22px 30px"
    >
      <div>
        <div class="flex items-center gap-3 mb-4">
          <LogoMark :size="40" />
          <span>
            <span class="block font-display font-bold text-white" style="font-size: 18px">
              {{ academy.name }}
            </span>
            <span
              class="block font-bold"
              :style="{
                fontSize: '10px',
                letterSpacing: '.16em',
                textTransform: 'uppercase',
                marginTop: '-2px',
                color: 'var(--color-footer-faint)',
              }"
            >
              {{ brandSub }}
            </span>
          </span>
        </div>
        <p
          :style="{ fontSize: '14.5px', lineHeight: '1.65', maxWidth: '26em', color: 'var(--color-footer-muted)' }"
        >
          {{ footerBlurb }}
        </p>
      </div>

      <div v-for="col in footerColumns" :key="col.title">
        <h2 class="font-display font-semibold text-white mb-4" style="font-size: 13px; letter-spacing: .1em; text-transform: uppercase">
          {{ col.title }}
        </h2>
        <div class="flex flex-col gap-2.5">
          <NuxtLink
            v-for="link in col.links"
            :key="link.to"
            :to="link.to"
            class="no-underline hover:text-white transition-colors"
            :style="{ fontSize: '14.5px', color: 'var(--color-footer-muted)' }"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>

      <div>
        <h2 class="font-display font-semibold text-white mb-4" style="font-size: 13px; letter-spacing: .1em; text-transform: uppercase">
          Hubungi
        </h2>
        <div class="flex flex-col gap-2.5">
          <NuxtLink
            :to="cta.to"
            class="no-underline hover:text-white transition-colors"
            :style="{ fontSize: '14.5px', color: 'var(--color-footer-muted)' }"
          >
            {{ cta.label }}
          </NuxtLink>
          <a
            :href="wa"
            class="no-underline hover:text-white transition-colors"
            :style="{ fontSize: '14.5px', color: 'var(--color-footer-muted)' }"
          >
            WhatsApp
          </a>
          <a
            :href="mail"
            class="no-underline hover:text-white transition-colors"
            :style="{ fontSize: '14.5px', color: 'var(--color-footer-muted)' }"
          >
            {{ academy.contact.email }}
          </a>
        </div>
      </div>

      <div>
        <h2 class="font-display font-semibold text-white mb-4" style="font-size: 13px; letter-spacing: .1em; text-transform: uppercase">
          {{ portalLink.title }}
        </h2>
        <NuxtLink
          :to="portalLink.to"
          class="inline-flex items-center gap-2 no-underline hover:text-white transition-colors"
          :style="{
            fontSize: '13.5px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--color-footer-line)',
            color: 'var(--color-footer-text)',
          }"
        >
          {{ portalLink.label }} <span aria-hidden="true">→</span>
        </NuxtLink>
        <p :style="{ fontSize: '13px', marginTop: '12px', lineHeight: '1.6', color: 'var(--color-footer-faint)' }">
          {{ portalLink.note }}
        </p>
      </div>
    </div>

    <div
      class="mx-auto flex flex-wrap items-center justify-between gap-3"
      :style="{
        maxWidth: '1120px',
        padding: '18px 22px',
        borderTop: '1px solid var(--color-footer-line)',
        fontSize: '13px',
        color: 'var(--color-footer-faint)',
      }"
    >
      <span>© {{ academy.since }} to 2026 {{ academy.name }}. {{ academy.motto }}</span>
      <span>Privasi · Terma</span>
    </div>
  </footer>
</template>
