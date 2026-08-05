<script setup lang="ts">
import { ref, computed } from 'vue'
import Stepper from '~/components/marketing/Stepper.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { useAcademy } from '~/composables/useAcademy'
import { useSubjects } from '~/composables/useSubjects'
import { useSiteContent } from '~/composables/useSiteContent'
import { pillStyle } from '~/utils/status'
import { emptyRegForm, canAdvance, canSubmit, isValidMyPhone } from '~/utils/validation'

// Five steps. The branch step is gone: Hz is fully online, so there is nothing
// to choose between. Nothing is posted anywhere; phase 1 is static.
const { academy } = useAcademy()
const { all: subjects } = useSubjects()
const { contact } = useSiteContent()

const TOTAL = 5
const form = ref(emptyRegForm())
const step = ref(0)
const submitted = ref(false)

const stepMeta = [
  { title: 'Maklumat ibu bapa', icon: '👨‍👩‍👧', tone: 'pink' },
  { title: 'Maklumat pelajar', icon: '🧑‍🎓', tone: 'blue' },
  { title: 'Pilih subjek', icon: '📚', tone: 'amber' },
  { title: 'Waktu yang sesuai', icon: '🗓️', tone: 'green' },
  { title: 'Semak dan hantar', icon: '✅', tone: 'violet' },
] as const

const levels = [
  'Tahun 1', 'Tahun 2', 'Tahun 3', 'Tahun 4', 'Tahun 5', 'Tahun 6',
  'Tingkatan 1', 'Tingkatan 2', 'Tingkatan 3', 'Tingkatan 4', 'Tingkatan 5',
]

const slotOptions = ['Pagi', 'Petang', 'Malam', 'Hujung minggu']

const current = computed(() => stepMeta[step.value]!)
const canBack = computed(() => step.value > 0)
const isLast = computed(() => step.value === TOTAL - 1)
const advanceOk = computed(() => canAdvance(step.value, form.value))
const submitOk = computed(() => canSubmit(form.value))

const phoneError = computed(
  () => form.value.phone.trim() !== '' && !isValidMyPhone(form.value.phone),
)

const inputStyle = {
  width: '100%',
  padding: '13px 15px',
  borderRadius: 'var(--radius-input)',
  border: '1.5px solid var(--color-border-input)',
  background: 'var(--color-surface-subtle)',
  fontFamily: 'inherit',
  fontSize: '14px',
} as const

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '700',
  marginBottom: '7px',
  color: 'var(--color-text-body)',
} as const

const waLink = `https://wa.me/${academy.contact.whatsapp}`

function next() {
  if (!advanceOk.value) return
  step.value = Math.min(TOTAL - 1, step.value + 1)
}
function back() {
  step.value = Math.max(0, step.value - 1)
}
function submit() {
  if (!submitOk.value) return
  submitted.value = true
}

function toggle(list: string[], value: string) {
  const i = list.indexOf(value)
  if (i === -1) list.push(value)
  else list.splice(i, 1)
}
</script>

<template>
  <div class="mx-auto" style="max-width: 760px">
    <!-- ---------------------------------------------------------- WIZARD -->
    <div v-if="!submitted">
      <div style="margin-bottom: 26px">
        <Stepper :step="step" :total="TOTAL" />
      </div>

      <div
        :style="{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-marketing)',
          borderRadius: 'var(--radius-card-lg)',
          padding: 'clamp(22px, 4vw, 34px)',
          boxShadow: 'var(--shadow-card-hover)',
        }"
      >
        <div class="flex items-center" style="gap: 11px; margin-bottom: 24px">
          <div
            class="grid place-items-center shrink-0"
            :style="{ width: '44px', height: '44px', borderRadius: '14px', fontSize: '21px', ...pillStyle(current.tone) }"
          >
            {{ current.icon }}
          </div>
          <div>
            <div class="font-display font-semibold text-ink" style="font-size: 19px">
              {{ current.title }}
            </div>
            <div class="font-semibold" style="font-size: 12.5px; color: var(--color-muted)">
              Langkah {{ step + 1 }} daripada {{ TOTAL }}
            </div>
          </div>
        </div>

        <!-- STEP 0: guardian -->
        <div
          v-if="step === 0"
          style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px"
        >
          <label style="display: block">
            <span :style="labelStyle">Nama ibu atau bapa</span>
            <input v-model="form.parentName" placeholder="Cth: Puan Aisyah" :style="inputStyle" >
          </label>
          <label style="display: block">
            <span :style="labelStyle">No. telefon (WhatsApp)</span>
            <input
              v-model="form.phone"
              placeholder="Cth: 012-345 6789"
              :style="{ ...inputStyle, borderColor: phoneError ? 'var(--color-fg-overdue)' : 'var(--color-border-input)' }"
            >
            <span
              v-if="phoneError"
              style="display: block; font-size: 12px; font-weight: 600; margin-top: 6px; color: var(--color-fg-overdue)"
            >
              ⚠️ Sila masukkan nombor telefon Malaysia yang sah, cth: 012-345 6789.
            </span>
          </label>
        </div>

        <!-- STEP 1: student -->
        <div
          v-else-if="step === 1"
          style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px"
        >
          <label style="display: block">
            <span :style="labelStyle">Nama pelajar</span>
            <input v-model="form.studentName" placeholder="Cth: Adam Haziq" :style="inputStyle" >
          </label>
          <label style="display: block">
            <span :style="labelStyle">Tahun atau tingkatan</span>
            <select v-model="form.level" :style="{ ...inputStyle, cursor: 'pointer' }">
              <option value="" disabled>Pilih tahap</option>
              <option v-for="lv in levels" :key="lv" :value="lv">{{ lv }}</option>
            </select>
          </label>
          <label style="display: block; grid-column: 1 / -1">
            <span :style="labelStyle">Nama sekolah</span>
            <input v-model="form.school" placeholder="Cth: SK Kota Warisan" :style="inputStyle" >
          </label>
        </div>

        <!-- STEP 2: subjects -->
        <div v-else-if="step === 2" style="display: flex; gap: 10px; flex-wrap: wrap">
          <span
            v-for="s in subjects"
            :key="s.name"
            role="button"
            tabindex="0"
            class="inline-flex items-center font-bold"
            :style="{
              gap: '7px',
              padding: '11px 16px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '13.5px',
              cursor: 'pointer',
              transition: 'border-color .15s, background .15s, color .15s',
              border: form.subjects.includes(s.name)
                ? '1.5px solid transparent'
                : '1.5px solid var(--color-border-input)',
              ...(form.subjects.includes(s.name)
                ? pillStyle(s.tone)
                : { background: 'var(--color-surface)', color: 'var(--color-text-body)' }),
            }"
            @click="toggle(form.subjects, s.name)"
            @keydown.enter.prevent="toggle(form.subjects, s.name)"
            @keydown.space.prevent="toggle(form.subjects, s.name)"
          >
            <span>{{ s.icon }}</span>
            {{ s.name }}
            <span v-if="form.subjects.includes(s.name)" style="font-weight: 800">✓</span>
          </span>
        </div>

        <!-- STEP 3: schedule -->
        <div v-else-if="step === 3">
          <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 18px">
            <span
              v-for="sl in slotOptions"
              :key="sl"
              role="button"
              tabindex="0"
              class="inline-flex items-center font-bold"
              :style="{
                padding: '11px 18px',
                borderRadius: '14px',
                fontSize: '13.5px',
                cursor: 'pointer',
                transition: 'border-color .15s, background .15s, color .15s',
                border: form.slots.includes(sl)
                  ? '1.5px solid var(--color-accent-blue)'
                  : '1.5px solid var(--color-border-input)',
                background: form.slots.includes(sl) ? 'var(--color-tile-blue)' : 'var(--color-surface)',
                color: form.slots.includes(sl) ? 'var(--color-fg-blue)' : 'var(--color-text-body)',
              }"
              @click="toggle(form.slots, sl)"
              @keydown.enter.prevent="toggle(form.slots, sl)"
              @keydown.space.prevent="toggle(form.slots, sl)"
            >
              {{ sl }}
            </span>
          </div>
          <label style="display: block">
            <span :style="labelStyle">Nota tambahan (pilihan)</span>
            <textarea
              v-model="form.notes"
              placeholder="Cth: anak perlu fokus lebih pada Matematik dan Sains"
              :style="{ ...inputStyle, minHeight: '90px', resize: 'vertical' }"
            />
          </label>
        </div>

        <!-- STEP 4: review -->
        <div
          v-else-if="step === 4"
          :style="{ background: 'var(--color-surface-lavender)', borderRadius: '16px', padding: '20px' }"
        >
          <div style="font-size: 13.5px; color: var(--color-ink-soft); line-height: 1.7">
            Sila semak maklumat anda sebelum menghantar. Kami akan hubungi anda melalui WhatsApp
            dalam masa 24 jam.
          </div>
          <div
            style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-top: 16px"
          >
            <div :style="{ background: 'var(--color-surface)', borderRadius: '12px', padding: '13px' }">
              <div style="font-size: 11px; color: var(--color-muted); font-weight: 700">IBU BAPA</div>
              <div class="text-ink" style="font-weight: 700; font-size: 14px">
                {{ form.parentName || '—' }}<template v-if="form.phone"> · {{ form.phone }}</template>
              </div>
            </div>
            <div :style="{ background: 'var(--color-surface)', borderRadius: '12px', padding: '13px' }">
              <div style="font-size: 11px; color: var(--color-muted); font-weight: 700">PELAJAR</div>
              <div class="text-ink" style="font-weight: 700; font-size: 14px">
                {{ form.studentName || '—' }}<template v-if="form.level"> · {{ form.level }}</template>
              </div>
              <div v-if="form.school" style="font-size: 12px; color: var(--color-muted); font-weight: 600; margin-top: 2px">
                {{ form.school }}
              </div>
            </div>
            <div :style="{ background: 'var(--color-surface)', borderRadius: '12px', padding: '13px' }">
              <div style="font-size: 11px; color: var(--color-muted); font-weight: 700">SUBJEK</div>
              <div class="text-ink" style="font-weight: 700; font-size: 14px">{{ form.subjects.join(' · ') || '—' }}</div>
            </div>
            <div :style="{ background: 'var(--color-surface)', borderRadius: '12px', padding: '13px' }">
              <div style="font-size: 11px; color: var(--color-muted); font-weight: 700">WAKTU</div>
              <div class="text-ink" style="font-weight: 700; font-size: 14px">{{ form.slots.join(' · ') || '—' }}</div>
            </div>
            <div v-if="form.notes" :style="{ background: 'var(--color-surface)', borderRadius: '12px', padding: '13px' }">
              <div style="font-size: 11px; color: var(--color-muted); font-weight: 700">NOTA</div>
              <div class="text-ink" style="font-weight: 600; font-size: 13.5px; line-height: 1.5">{{ form.notes }}</div>
            </div>
          </div>

          <div class="flex items-start gap-3" style="margin-top: 18px">
            <input
              id="reg-consent"
              v-model="form.consent"
              type="checkbox"
              :style="{ width: '18px', height: '18px', marginTop: '2px', flex: '0 0 18px', accentColor: 'var(--color-brand)' }"
            >
            <label for="reg-consent" style="font-size: 13px; line-height: 1.55; color: var(--color-ink-soft)">
              {{ contact.consentLabel }}
            </label>
          </div>
        </div>

        <div class="flex items-center" style="gap: 12px; margin-top: 28px">
          <AppButton v-if="canBack" variant="outline" pill @click="back">← Kembali</AppButton>

          <div style="margin-left: auto; display: flex">
            <AppButton v-if="isLast" variant="green" pill :disabled="!submitOk" @click="submit">
              Hantar pendaftaran ✓
            </AppButton>
            <AppButton
              v-else
              variant="gradient"
              pill
              :style="!advanceOk ? { opacity: '.5', cursor: 'not-allowed', pointerEvents: 'none' } : {}"
              :aria-disabled="!advanceOk"
              @click="next"
            >
              Seterusnya →
            </AppButton>
          </div>
        </div>
      </div>
    </div>

    <!-- ----------------------------------------------------- CONFIRMATION -->
    <div v-else class="hz-pop" style="text-align: center; padding: 40px 0">
      <div
        class="grid place-items-center mx-auto"
        :style="{
          width: '96px',
          height: '96px',
          borderRadius: '50%',
          fontSize: '46px',
          background: 'var(--green-gradient)',
          boxShadow: 'var(--shadow-wa)',
          marginBottom: '26px',
        }"
      >
        🎉
      </div>
      <h2 class="font-display font-bold text-ink" style="font-size: clamp(1.8rem, 3.6vw, 2.4rem); margin: 0 0 12px">
        Pendaftaran diterima
      </h2>
      <p
        class="mx-auto"
        style="font-size: 16px; color: var(--color-ink-soft); line-height: 1.6; max-width: 440px; margin: 0 auto 30px"
      >
        Pasukan {{ academy.name }} akan hubungi anda melalui WhatsApp untuk mengesahkan pendaftaran
        dan jadual kelas anak anda.
      </p>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap">
        <AppButton :to="waLink" variant="green" pill>💬 Teruskan ke WhatsApp</AppButton>
        <AppButton to="/" variant="outline" pill>Kembali ke laman utama</AppButton>
      </div>
    </div>
  </div>
</template>
