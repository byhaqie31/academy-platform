<script setup lang="ts">
import { computed, ref } from 'vue'
import AppButton from '~/components/ui/AppButton.vue'
import { useSubjects } from '~/composables/useSubjects'
import type { NewStudent } from '~/types'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: []; submit: [student: NewStudent] }>()

const subjects = useSubjects()

// KPM levels, in the order a Malaysian parent would expect to see them.
const levels = [
  ...Array.from({ length: 6 }, (_, i) => `Tahun ${i + 1}`),
  ...Array.from({ length: 5 }, (_, i) => `Tingkatan ${i + 1}`),
]

const name = ref('')
const level = ref(levels[0]!)
const picked = ref<string[]>([])

const canSubmit = computed(() => name.value.trim().length > 0 && picked.value.length > 0)

function togglePick(subject: string) {
  picked.value = picked.value.includes(subject)
    ? picked.value.filter((s) => s !== subject)
    : [...picked.value, subject]
}

function reset() {
  name.value = ''
  level.value = levels[0]!
  picked.value = []
}

function submit() {
  if (!canSubmit.value) return
  emit('submit', { name: name.value.trim(), level: level.value, subjects: [...picked.value] })
  reset()
}

function close() {
  reset()
  emit('close')
}

const fieldStyle = {
  padding: '11px 13px',
  borderRadius: '12px',
  border: '1.5px solid var(--color-border-input)',
  backgroundColor: 'var(--color-surface-subtle)',
  fontSize: '13.5px',
  fontWeight: '600',
  width: '100%',
}
</script>

<template>
  <div
    v-if="open"
    class="hz-modal-overlay"
    :style="{
      position: 'fixed',
      inset: '0',
      zIndex: '60',
      display: 'grid',
      placeItems: 'center',
      padding: '20px',
      background: 'rgba(30,35,72,.42)',
    }"
    @click="close"
  >
    <div
      class="bg-surface"
      :style="{
        width: '480px',
        maxWidth: '100%',
        borderRadius: '24px',
        padding: '26px',
        boxShadow: 'var(--shadow-modal)',
      }"
      @click.stop
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 class="font-display font-bold text-ink" :style="{ fontSize: '20px' }">
            Register new student
          </h2>
          <p class="text-muted" :style="{ fontSize: '13px', marginTop: '3px' }">
            They join tonight's roll straight away.
          </p>
        </div>
        <button
          type="button"
          aria-label="Close"
          class="grid place-items-center cursor-pointer shrink-0"
          :style="{
            width: '34px',
            height: '34px',
            borderRadius: '11px',
            fontSize: '15px',
            background: 'var(--color-surface-subtle)',
            color: 'var(--color-ink-soft)',
            border: '1px solid var(--color-border)',
          }"
          @click="close"
        >
          <UIcon name="i-fluent-dismiss-20-regular" :style="{ width: '16px', height: '16px' }" />
        </button>
      </div>

      <div :style="{ marginTop: '20px' }">
        <label for="student-name" class="block font-bold text-ink-soft" :style="{ fontSize: '12px', marginBottom: '6px' }">
          Student name
        </label>
        <input
          id="student-name"
          v-model="name"
          type="text"
          placeholder="e.g. Nurul Izzah"
          class="text-ink outline-none focus:border-brand!"
          :style="fieldStyle"
        />
      </div>

      <div :style="{ marginTop: '14px' }">
        <label for="student-level" class="block font-bold text-ink-soft" :style="{ fontSize: '12px', marginBottom: '6px' }">
          Level
        </label>
        <select
          id="student-level"
          v-model="level"
          class="text-ink outline-none cursor-pointer hz-select"
          :style="{ ...fieldStyle, padding: '11px 34px 11px 13px' }"
        >
          <option v-for="l in levels" :key="l" :value="l">{{ l }}</option>
        </select>
      </div>

      <div :style="{ marginTop: '14px' }">
        <span class="block font-bold text-ink-soft" :style="{ fontSize: '12px', marginBottom: '8px' }">
          Subjects
        </span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="s in subjects.all"
            :key="s.name"
            type="button"
            class="cursor-pointer font-bold"
            :style="picked.includes(s.name)
              ? {
                padding: '7px 13px', borderRadius: '999px', fontSize: '12.5px',
                background: 'var(--color-tile-violet)', color: 'var(--color-fg-violet)',
                border: '1.5px solid var(--color-dashed)',
              }
              : {
                padding: '7px 13px', borderRadius: '999px', fontSize: '12.5px',
                background: 'var(--color-surface-subtle)', color: 'var(--color-ink-soft)',
                border: '1.5px solid var(--color-border-input)',
              }"
            @click="togglePick(s.name)"
          >
            {{ s.name }}
          </button>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3" :style="{ marginTop: '24px' }">
        <AppButton variant="outline" @click="close">Cancel</AppButton>
        <AppButton variant="gradient" :disabled="!canSubmit" @click="submit">
          Register student
        </AppButton>
      </div>
    </div>
  </div>
</template>
