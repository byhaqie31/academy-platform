<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import LogoMark from '~/components/ui/LogoMark.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { useAcademy } from '~/composables/useAcademy'
import { isValidMyPhone, maskMyPhone } from '~/utils/validation'

// No auth library, no request, no session. Phase 1 is a static marketing build;
// this page exists so the portal has an address, not so it has a login.
// The 6-digit code is theatre: any six digits open the door.
definePageMeta({ layout: 'portal-auth' })

const { academy } = useAcademy()
const router = useRouter()

const step = ref<'phone' | 'code'>('phone')
const phone = ref('')
const canSend = computed(() => isValidMyPhone(phone.value))
const masked = computed(() => maskMyPhone(phone.value))

/** one string per box, so focus can walk them one digit at a time */
const digits = ref<string[]>(['', '', '', '', '', ''])
const boxes = ref<HTMLInputElement[]>([])
const verifying = ref(false)
const resent = ref(false)

function toCode() {
  step.value = 'code'
  resent.value = false
  nextTick(() => boxes.value[0]?.focus())
}

function toPhone() {
  step.value = 'phone'
  digits.value = ['', '', '', '', '', '']
  verifying.value = false
}

function onDigit(i: number, e: Event) {
  const el = e.target as HTMLInputElement
  const clean = el.value.replace(/\D/g, '')
  // a paste of the full code can land in any box; spread it out
  if (clean.length > 1) {
    const spread = clean.slice(0, 6).split('')
    spread.forEach((d, j) => {
      if (j < 6) digits.value[j] = d
    })
    boxes.value[Math.min(spread.length, 5)]?.focus()
    return
  }
  digits.value[i] = clean
  if (clean && i < 5) boxes.value[i + 1]?.focus()
}

function onKeydown(i: number, e: KeyboardEvent) {
  if (e.key === 'Backspace' && !digits.value[i] && i > 0) boxes.value[i - 1]?.focus()
}

function resend() {
  digits.value = ['', '', '', '', '', '']
  resent.value = true
  boxes.value[0]?.focus()
}

/** any six digits verify; the pause is what sells it as real */
watch(
  () => digits.value.join(''),
  (code) => {
    if (code.length === 6 && !verifying.value) {
      verifying.value = true
      setTimeout(() => router.push('/portal/parent'), 900)
    }
  },
)

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

    <template v-if="step === 'code'">
      <h1 class="font-display font-semibold text-ink" style="font-size: 22px; line-height: 1.25">
        Masukkan kod pengesahan
      </h1>
      <p class="text-muted" style="font-size: 15px; line-height: 1.65; margin: 10px 0 22px">
        Kod 6 digit dihantar ke WhatsApp <strong class="text-ink">{{ masked }}</strong>.
      </p>

      <div class="flex justify-between" :style="{ gap: '8px', marginBottom: '18px' }">
        <input
          v-for="(d, i) in digits"
          :key="i"
          :ref="(el) => { if (el) boxes[i] = el as HTMLInputElement }"
          :value="d"
          type="text"
          inputmode="numeric"
          autocomplete="one-time-code"
          :aria-label="`Digit ${i + 1}`"
          :disabled="verifying"
          class="text-center font-bold text-ink"
          :style="{
            width: '100%',
            maxWidth: '52px',
            padding: '13px 0',
            border: d ? '1.5px solid var(--color-brand)' : '1.5px solid var(--color-border-input)',
            borderRadius: 'var(--radius-input)',
            fontSize: '20px',
            background: 'var(--color-surface)',
          }"
          @input="onDigit(i, $event)"
          @keydown="onKeydown(i, $event)"
        >
      </div>

      <p
        v-if="verifying"
        class="text-center font-semibold"
        :style="{ color: 'var(--color-brand-deep)', fontSize: '14px', margin: '0 0 4px' }"
      >
        Mengesahkan...
      </p>

      <div v-else class="flex items-center justify-center" :style="{ gap: '18px' }">
        <button
          type="button"
          class="font-semibold text-muted hover:text-brand-deep transition-colors"
          style="font-size: 13.5px"
          @click="resend"
        >
          Hantar semula kod
        </button>
        <button
          type="button"
          class="font-semibold text-muted hover:text-brand-deep transition-colors"
          style="font-size: 13.5px"
          @click="toPhone"
        >
          Tukar nombor
        </button>
      </div>

      <p
        v-if="resent && !verifying"
        class="text-center text-faint"
        style="font-size: 12.5px; margin: 10px 0 0"
      >
        Kod baharu dihantar ke WhatsApp anda.
      </p>
    </template>

    <form v-else novalidate @submit.prevent="toCode">
      <h1 class="font-display font-semibold text-ink" style="font-size: 22px; line-height: 1.25">
        Log masuk portal ibu bapa
      </h1>
      <p class="text-muted" style="font-size: 15px; line-height: 1.65; margin: 10px 0 24px">
        Masukkan nombor telefon yang anda daftarkan dengan kami. Kami hantar kod pengesahan
        6 digit ke WhatsApp anda, jadi tiada kata laluan untuk diingat.
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
        Hantar kod ke WhatsApp
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
