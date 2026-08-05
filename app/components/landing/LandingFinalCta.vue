<script setup lang="ts">
import { computed, ref } from 'vue'
import AppButton from '~/components/ui/AppButton.vue'
import { isValidMyPhone } from '~/utils/validation'
import type { LandingCampaign, SiteSection } from '~/types'

// Phase 1 is static: nothing is posted. Submitting swaps the card for an
// acknowledgement so the click-through feels complete.
//
// The enquiry would be tagged with campaign.slug when a backend exists, which
// is why the slug is one string end to end.
const props = defineProps<{
  campaign: LandingCampaign
  section: SiteSection
  labels: Record<string, string>
  consentLabel: string
  waHref: string
}>()

const name = ref('')
const phone = ref('')
const level = ref(props.campaign.form.levelOptions[0] ?? '')
// Unticked by default. Consent has to be a deliberate act, not a default.
const consent = ref(false)
const sent = ref(false)

const canSend = computed(
  () => name.value.trim().length > 0 && isValidMyPhone(phone.value) && consent.value,
)

const showForm = computed(() => props.campaign.cta.mode !== 'whatsapp')
const showWhatsApp = computed(() => props.campaign.cta.mode !== 'form')

const fieldStyle = {
  width: '100%',
  padding: '14px 16px',
  border: '1.5px solid var(--color-border-input)',
  borderRadius: 'var(--radius-input)',
  fontSize: '15.5px',
  color: 'var(--color-ink)',
  background: 'var(--color-surface)',
  marginBottom: '18px',
}
const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '7px' }
</script>

<template>
  <section id="daftar" :style="{ background: 'var(--color-surface-lavender)' }">
    <div class="mx-auto" style="max-width: 1060px; padding: 76px 22px">
      <div class="text-center mx-auto" style="max-width: 34em; margin-bottom: 34px">
        <span
          class="font-bold"
          :style="{
            fontSize: '12.5px',
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: 'var(--color-brand)',
          }"
        >{{ section.eyebrow }}</span>
        <h2
          class="font-display font-semibold text-ink"
          style="font-size: clamp(1.6rem, 3.2vw, 2.2rem); line-height: 1.15; margin: 12px 0 0"
        >
          {{ section.title }}
        </h2>
        <p class="text-muted" style="font-size: 16.5px; line-height: 1.65; margin-top: 12px">
          {{ section.lede }}
        </p>
      </div>

      <div
        class="mx-auto"
        :style="{
          maxWidth: '560px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card-lg)',
          padding: 'clamp(24px, 4vw, 38px)',
          boxShadow: 'var(--shadow-card-hover)',
        }"
      >
        <div v-if="sent" class="text-center" style="padding: 20px 0">
          <div
            aria-hidden="true"
            class="grid place-items-center mx-auto"
            :style="{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              fontSize: '22px',
              background: 'var(--color-tile-green)',
              color: 'var(--color-fg-green)',
              marginBottom: '16px',
            }"
          >✓</div>
          <h3 class="font-display font-semibold text-ink" style="font-size: 19px">
            {{ labels.sentTitle }}
          </h3>
          <p class="text-muted" style="font-size: 15px; line-height: 1.65; margin-top: 8px">
            {{ labels.sentBody }}
          </p>
        </div>

        <template v-else>
          <form v-if="showForm" novalidate @submit.prevent="sent = true">
            <label for="lp-name" class="text-ink" :style="labelStyle">{{ labels.name }}</label>
            <input id="lp-name" v-model="name" type="text" :placeholder="labels.namePlaceholder" :style="fieldStyle" >

            <label for="lp-phone" class="text-ink" :style="labelStyle">{{ labels.phone }}</label>
            <input id="lp-phone" v-model="phone" type="tel" :placeholder="labels.phonePlaceholder" :style="fieldStyle" >

            <label for="lp-level" class="text-ink" :style="labelStyle">{{ labels.level }}</label>
            <select id="lp-level" v-model="level" :style="fieldStyle">
              <option v-for="opt in campaign.form.levelOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>

            <div class="flex items-start gap-3" style="margin-bottom: 22px">
              <input
                id="lp-consent"
                v-model="consent"
                type="checkbox"
                :style="{ width: '18px', height: '18px', marginTop: '2px', flex: '0 0 18px', accentColor: 'var(--color-brand)' }"
              >
              <label for="lp-consent" class="text-muted" style="font-size: 13.5px; line-height: 1.55">
                {{ consentLabel }}
              </label>
            </div>

            <AppButton type="submit" variant="gradient" size="lg" pill block :disabled="!canSend">
              {{ campaign.cta.label }}
            </AppButton>
            <p v-if="!canSend" class="text-faint" style="font-size: 12.5px; margin-top: 10px; line-height: 1.5">
              {{ labels.incomplete }}
            </p>
          </form>

          <div
            v-if="showForm && showWhatsApp"
            class="flex items-center gap-3.5 text-muted"
            style="margin: 22px 0; font-size: 14px"
          >
            <span class="grow" :style="{ height: '1px', background: 'var(--color-border)' }" />
            {{ labels.or }}
            <span class="grow" :style="{ height: '1px', background: 'var(--color-border)' }" />
          </div>

          <template v-if="showWhatsApp">
            <AppButton :to="waHref" variant="whatsapp" size="lg" pill block>
              {{ labels.whatsapp }}
            </AppButton>
            <p class="text-muted text-center" style="font-size: 13px; margin-top: 16px; line-height: 1.5">
              {{ labels.reply }}
            </p>
          </template>
        </template>
      </div>
    </div>
  </section>
</template>
