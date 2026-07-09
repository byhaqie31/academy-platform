<script setup lang="ts">
import { ref, computed } from 'vue'
import Stepper from '~/components/marketing/Stepper.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { useAcademy } from '~/composables/useAcademy'
import { useSubjects } from '~/composables/useSubjects'
import { pillStyle } from '~/utils/status'
import { emptyRegForm, canAdvance, isValidMyPhone } from '~/utils/validation'

const { academy, branches, branchById } = useAcademy()
const { all: subjects } = useSubjects()

const TOTAL = 6
const form = ref(emptyRegForm())
const step = ref(0)
const submitted = ref(false)

// Per-step header meta, mirroring the prototype's stepMeta.
const stepMeta = [
  { title: 'Parent details', icon: '👨‍👩‍👧', tone: 'pink' },
  { title: 'Student details', icon: '🧑‍🎓', tone: 'blue' },
  { title: 'Choose a branch', icon: '📍', tone: 'violet' },
  { title: 'Choose subjects', icon: '📚', tone: 'amber' },
  { title: 'Preferred schedule', icon: '🗓️', tone: 'green' },
  { title: 'Review & submit', icon: '✅', tone: 'violet' },
] as const

const levels = [
  'Tahun 1', 'Tahun 2', 'Tahun 3', 'Tahun 4', 'Tahun 5', 'Tahun 6',
  'Tingkatan 1', 'Tingkatan 2', 'Tingkatan 3', 'Tingkatan 4', 'Tingkatan 5',
]

const slotOptions = ['Morning', 'Afternoon', 'Evening', 'Weekend']

const current = computed(() => stepMeta[step.value]!)
const canBack = computed(() => step.value > 0)
const isLast = computed(() => step.value === TOTAL - 1)
const advanceOk = computed(() => canAdvance(step.value, form.value))

const phoneError = computed(
  () => form.value.phone.trim() !== '' && !isValidMyPhone(form.value.phone),
)

const inputStyle = {
  width: '100%',
  padding: '13px 15px',
  borderRadius: '13px',
  border: '1.5px solid var(--color-border-input)',
  background: 'var(--color-surface-subtle)',
  fontFamily: 'inherit',
  fontSize: '14px',
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
  submitted.value = true
}

function toggle(list: string[], value: string) {
  const i = list.indexOf(value)
  if (i === -1) list.push(value)
  else list.splice(i, 1)
}

const branchNames = computed(() =>
  form.value.branches.map((id) => branchById(id)?.name ?? id),
)
</script>

<template>
  <div class="mx-auto" style="max-width: 760px">
    <!-- ---------------------------------------------------------- WIZARD -->
    <div v-if="!submitted">
      <!-- stepper -->
      <div style="margin-bottom: 26px">
        <Stepper :step="step" :total="TOTAL" />
      </div>

      <!-- card -->
      <div
        :style="{
          background: '#fff',
          border: '1px solid var(--color-border-marketing)',
          borderRadius: '24px',
          padding: 'clamp(22px, 4vw, 34px)',
          boxShadow: '0 14px 36px rgba(30,35,72,.07)',
        }"
      >
        <!-- header: step icon tile + title + langkah label -->
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
              Step {{ step + 1 }} of {{ TOTAL }}
            </div>
          </div>
        </div>

        <!-- STEP 0 — Ibu bapa -->
        <div
          v-if="step === 0"
          style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px"
        >
          <label style="display: block">
            <span style="display: block; font-size: 13px; font-weight: 700; margin-bottom: 7px; color: var(--color-text-body)">Parent's name</span>
            <input v-model="form.parentName" placeholder="e.g. Puan Aisyah" :style="inputStyle" />
          </label>
          <label style="display: block">
            <span style="display: block; font-size: 13px; font-weight: 700; margin-bottom: 7px; color: var(--color-text-body)">Phone number (WhatsApp)</span>
            <input
              v-model="form.phone"
              placeholder="e.g. 012-345 6789"
              :style="{ ...inputStyle, borderColor: phoneError ? 'var(--color-fg-overdue)' : 'var(--color-border-input)' }"
            />
            <span
              v-if="phoneError"
              style="display: block; font-size: 12px; font-weight: 600; margin-top: 6px; color: var(--color-fg-overdue)"
            >
              ⚠️ Please enter a valid Malaysian phone number, e.g. 012-345 6789.
            </span>
          </label>
        </div>

        <!-- STEP 1 — Pelajar -->
        <div
          v-else-if="step === 1"
          style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px"
        >
          <label style="display: block">
            <span style="display: block; font-size: 13px; font-weight: 700; margin-bottom: 7px; color: var(--color-text-body)">Student's name</span>
            <input v-model="form.studentName" placeholder="e.g. Adam Haziq" :style="inputStyle" />
          </label>
          <label style="display: block">
            <span style="display: block; font-size: 13px; font-weight: 700; margin-bottom: 7px; color: var(--color-text-body)">School year / form</span>
            <select v-model="form.level" :style="{ ...inputStyle, cursor: 'pointer' }">
              <option value="" disabled>Select level</option>
              <option v-for="lv in levels" :key="lv" :value="lv">{{ lv }}</option>
            </select>
          </label>
          <label style="display: block; grid-column: 1 / -1">
            <span style="display: block; font-size: 13px; font-weight: 700; margin-bottom: 7px; color: var(--color-text-body)">School name</span>
            <input v-model="form.school" placeholder="e.g. SK Kota Warisan" :style="inputStyle" />
          </label>
        </div>

        <!-- STEP 2 — Cawangan -->
        <div
          v-else-if="step === 2"
          style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px"
        >
          <div
            v-for="b in branches"
            :key="b.id"
            role="button"
            tabindex="0"
            @click="toggle(form.branches, b.id)"
            @keydown.enter.prevent="toggle(form.branches, b.id)"
            @keydown.space.prevent="toggle(form.branches, b.id)"
            class="flex items-center"
            :style="{
              gap: '11px',
              padding: '16px',
              borderRadius: '15px',
              cursor: 'pointer',
              transition: 'border-color .15s, background .15s',
              border: form.branches.includes(b.id)
                ? '1.5px solid var(--color-brand-deep)'
                : '1.5px solid var(--color-border-input)',
              background: form.branches.includes(b.id) ? 'var(--color-surface-lavender)' : '#fff',
            }"
          >
            <div
              class="grid place-items-center shrink-0"
              :style="{ width: '38px', height: '38px', borderRadius: '11px', fontSize: '17px', ...pillStyle('blue') }"
            >
              📍
            </div>
            <div>
              <div class="font-bold text-ink" style="font-size: 13.5px">{{ b.name }}</div>
              <div class="font-semibold" style="font-size: 11.5px; color: var(--color-muted)">{{ b.area }}</div>
            </div>
            <span v-if="form.branches.includes(b.id)" style="margin-left: auto; color: var(--color-brand-deep); font-weight: 800">✓</span>
          </div>
        </div>

        <!-- STEP 3 — Subjek -->
        <div v-else-if="step === 3" style="display: flex; gap: 10px; flex-wrap: wrap">
          <span
            v-for="s in subjects"
            :key="s.name"
            role="button"
            tabindex="0"
            @click="toggle(form.subjects, s.name)"
            @keydown.enter.prevent="toggle(form.subjects, s.name)"
            @keydown.space.prevent="toggle(form.subjects, s.name)"
            class="inline-flex items-center font-bold"
            :style="{
              gap: '7px',
              padding: '11px 16px',
              borderRadius: '999px',
              fontSize: '13.5px',
              cursor: 'pointer',
              transition: 'border-color .15s, background .15s, color .15s',
              border: form.subjects.includes(s.name)
                ? '1.5px solid transparent'
                : '1.5px solid var(--color-border-input)',
              ...(form.subjects.includes(s.name) ? pillStyle(s.tone) : { background: '#fff', color: 'var(--color-text-body)' }),
            }"
          >
            <span>{{ s.icon }}</span>
            {{ s.name }}
            <span v-if="form.subjects.includes(s.name)" style="font-weight: 800">✓</span>
          </span>
        </div>

        <!-- STEP 4 — Jadual -->
        <div v-else-if="step === 4">
          <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 18px">
            <span
              v-for="sl in slotOptions"
              :key="sl"
              role="button"
              tabindex="0"
              @click="toggle(form.slots, sl)"
              @keydown.enter.prevent="toggle(form.slots, sl)"
              @keydown.space.prevent="toggle(form.slots, sl)"
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
                background: form.slots.includes(sl) ? 'var(--color-tile-blue)' : '#fff',
                color: form.slots.includes(sl) ? 'var(--color-fg-blue)' : 'var(--color-text-body)',
              }"
            >
              {{ sl }}
            </span>
          </div>
          <label style="display: block">
            <span style="display: block; font-size: 13px; font-weight: 700; margin-bottom: 7px; color: var(--color-text-body)">Additional notes (optional)</span>
            <textarea
              v-model="form.notes"
              placeholder="e.g. child needs extra focus on Matematik and Sains"
              :style="{ ...inputStyle, minHeight: '90px', resize: 'vertical' }"
            ></textarea>
          </label>
        </div>

        <!-- STEP 5 — Semak -->
        <div
          v-else-if="step === 5"
          :style="{ background: 'var(--color-surface-lavender)', borderRadius: '16px', padding: '20px' }"
        >
          <div style="font-size: 13.5px; color: var(--color-ink-soft); line-height: 1.7">
            Please confirm your details before submitting. Our team will review and contact you within 24 hours on WhatsApp.
          </div>
          <div
            style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-top: 16px"
          >
            <div style="background: #fff; border-radius: 12px; padding: 13px">
              <div style="font-size: 11px; color: var(--color-muted); font-weight: 700">PARENT</div>
              <div class="text-ink" style="font-weight: 700; font-size: 14px">
                {{ form.parentName || '—' }}<template v-if="form.phone"> · {{ form.phone }}</template>
              </div>
            </div>
            <div style="background: #fff; border-radius: 12px; padding: 13px">
              <div style="font-size: 11px; color: var(--color-muted); font-weight: 700">STUDENT</div>
              <div class="text-ink" style="font-weight: 700; font-size: 14px">
                {{ form.studentName || '—' }}<template v-if="form.level"> · {{ form.level }}</template>
              </div>
              <div v-if="form.school" style="font-size: 12px; color: var(--color-muted); font-weight: 600; margin-top: 2px">{{ form.school }}</div>
            </div>
            <div style="background: #fff; border-radius: 12px; padding: 13px">
              <div style="font-size: 11px; color: var(--color-muted); font-weight: 700">BRANCH</div>
              <div class="text-ink" style="font-weight: 700; font-size: 14px">{{ branchNames.join(', ') || '—' }}</div>
            </div>
            <div style="background: #fff; border-radius: 12px; padding: 13px">
              <div style="font-size: 11px; color: var(--color-muted); font-weight: 700">SUBJECTS</div>
              <div class="text-ink" style="font-weight: 700; font-size: 14px">{{ form.subjects.join(' · ') || '—' }}</div>
            </div>
            <div style="background: #fff; border-radius: 12px; padding: 13px">
              <div style="font-size: 11px; color: var(--color-muted); font-weight: 700">SCHEDULE</div>
              <div class="text-ink" style="font-weight: 700; font-size: 14px">{{ form.slots.join(' · ') || '—' }}</div>
            </div>
            <div v-if="form.notes" style="background: #fff; border-radius: 12px; padding: 13px">
              <div style="font-size: 11px; color: var(--color-muted); font-weight: 700">NOTES</div>
              <div class="text-ink" style="font-weight: 600; font-size: 13.5px; line-height: 1.5">{{ form.notes }}</div>
            </div>
          </div>
        </div>

        <!-- nav buttons -->
        <div class="flex items-center" style="gap: 12px; margin-top: 28px">
          <AppButton v-if="canBack" variant="outline" @click="back">← Back</AppButton>

          <div style="margin-left: auto; display: flex">
            <AppButton v-if="isLast" variant="green" @click="submit">
              Submit registration ✓
            </AppButton>
            <AppButton
              v-else
              variant="gradient"
              :style="!advanceOk ? { opacity: '.5', cursor: 'not-allowed', pointerEvents: 'none' } : {}"
              :aria-disabled="!advanceOk"
              @click="next"
            >
              Next →
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
          boxShadow: '0 16px 36px rgba(37,211,102,.35)',
          marginBottom: '26px',
        }"
      >
        🎉
      </div>
      <h2 class="font-display font-bold text-ink" style="font-size: clamp(1.8rem, 3.6vw, 2.4rem); margin: 0 0 12px">
        Registration received!
      </h2>
      <p
        class="mx-auto"
        style="font-size: 16px; color: var(--color-ink-soft); line-height: 1.6; max-width: 440px; margin: 0 auto 30px"
      >
        The {{ academy.name }} team will contact you on WhatsApp to confirm your registration and your child's class schedule.
      </p>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap">
        <AppButton :to="waLink" variant="green">💬 Continue to WhatsApp</AppButton>
        <AppButton to="/" variant="outline">Back to home</AppButton>
      </div>
    </div>
  </div>
</template>
