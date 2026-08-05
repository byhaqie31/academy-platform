<script setup lang="ts">
import { computed, ref } from 'vue'
import AppButton from '~/components/ui/AppButton.vue'
import { useSiteContent } from '~/composables/useSiteContent'
import { isValidMyPhone } from '~/utils/validation'

// Phase 1 is static: nothing is posted anywhere. Submitting swaps the panel for
// an acknowledgement so the click-through feels complete.
const { contact } = useSiteContent()

const name = ref('')
const phone = ref('')
const level = ref(contact.enquiryLevels[0] ?? '')
const subjects = ref('')
// Unticked by default. Consent has to be a deliberate act, not a default.
const consent = ref(false)
const sent = ref(false)

const canSend = computed(
  () => name.value.trim().length > 0 && isValidMyPhone(phone.value) && consent.value,
)

const fieldStyle = {
  width: '100%',
  padding: '13px 16px',
  border: '1.5px solid var(--color-border-input)',
  borderRadius: 'var(--radius-input)',
  fontSize: '15.5px',
  color: 'var(--color-ink)',
  background: 'var(--color-surface)',
  marginBottom: '16px',
}
const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }
</script>

<template>
  <div
    :style="{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-card)',
      padding: '30px',
      boxShadow: 'var(--shadow-card)',
    }"
  >
    <div v-if="sent" class="text-center" style="padding: 20px 0">
      <div
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
        aria-hidden="true"
      >
        ✓
      </div>
      <h2 class="font-display font-semibold text-ink" style="font-size: 19px">Terima kasih</h2>
      <p class="text-muted" style="font-size: 15px; line-height: 1.65; margin-top: 8px">
        Kami akan WhatsApp anda, biasanya dalam 15 minit pada waktu pejabat.
      </p>
    </div>

    <form v-else novalidate @submit.prevent="sent = true">
      <h2 class="font-display font-semibold text-ink" style="font-size: 19px; margin-bottom: 6px">
        Daftar minat
      </h2>
      <p class="text-muted" style="font-size: 15px; margin-bottom: 22px">
        Isi ruangan di bawah dan kami akan hubungi anda.
      </p>

      <label for="enq-name" class="text-ink" :style="labelStyle">Nama ibu atau bapa</label>
      <input id="enq-name" v-model="name" type="text" placeholder="Cth: Puan Aisyah" :style="fieldStyle" >

      <label for="enq-phone" class="text-ink" :style="labelStyle">No. telefon (WhatsApp)</label>
      <input id="enq-phone" v-model="phone" type="tel" placeholder="Cth: 012-345 6789" :style="fieldStyle" >

      <label for="enq-level" class="text-ink" :style="labelStyle">Tahap anak</label>
      <select id="enq-level" v-model="level" :style="fieldStyle">
        <option v-for="opt in contact.enquiryLevels" :key="opt" :value="opt">{{ opt }}</option>
      </select>

      <label for="enq-subjects" class="text-ink" :style="labelStyle">Subjek yang diminati</label>
      <input
        id="enq-subjects"
        v-model="subjects"
        type="text"
        placeholder="Cth: Matematik, Sains"
        :style="fieldStyle"
      >

      <div class="flex items-start gap-3" style="margin-bottom: 20px">
        <input
          id="enq-consent"
          v-model="consent"
          type="checkbox"
          :style="{ width: '18px', height: '18px', marginTop: '2px', flex: '0 0 18px', accentColor: 'var(--color-brand)' }"
        >
        <label for="enq-consent" class="text-muted" style="font-size: 13.5px; line-height: 1.55">
          {{ contact.consentLabel }}
        </label>
      </div>

      <AppButton type="submit" variant="gradient" size="lg" pill block :disabled="!canSend">
        Hantar
      </AppButton>
      <p v-if="!canSend" class="text-faint" style="font-size: 12.5px; margin-top: 10px; line-height: 1.5">
        Isi nama, nombor telefon dan tandakan kebenaran untuk menghantar.
      </p>
    </form>
  </div>
</template>
