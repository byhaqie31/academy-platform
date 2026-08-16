<script setup lang="ts">
import { ref } from 'vue'
import { useSubjects } from '~/composables/useSubjects'
import { useEducators } from '~/composables/useEducators'
import { useSchedule } from '~/composables/useSchedule'
import AppButton from '~/components/ui/AppButton.vue'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const subjects = useSubjects()
const educators = useEducators()
const days = useSchedule().days

// Pseudo-select fields: label + the option list to render inside a styled box.
const fields = [
  { label: 'Subject', options: subjects.all.map((s) => s.name) },
  { label: 'Class', options: ['Tahun 4 Bestari', 'Tingkatan 3 Cerdik', 'Tingkatan 5 Gigih', 'Tahun 6'] },
  { label: 'Tutor', options: educators.all.map((e) => e.name) },
  { label: 'Day', options: days },
]

// Time-slot chips; selection tracked in a ref.
const timeSlots = ['3:00 PM', '4:30 PM', '5:00 PM', '6:00 PM', '7:30 PM']
const selectedSlot = ref<string>('4:30 PM')
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
      backdropFilter: 'blur(3px)',
    }"
    @click="emit('close')"
  >
    <div
      class="bg-surface hz-modal-card"
      :style="{
        width: '520px',
        maxWidth: '100%',
        borderRadius: '24px',
        padding: '26px',
        boxShadow: 'var(--shadow-modal)',
      }"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 class="font-display font-bold text-ink" :style="{ fontSize: '20px' }">
            Assign new class
          </h2>
          <p class="text-muted" :style="{ fontSize: '13px', marginTop: '3px' }">
            Fill in the class details and pick a time slot.
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
          @click="emit('close')"
        >
          <UIcon name="i-fluent-dismiss-20-regular" :style="{ width: '16px', height: '16px' }" />
        </button>
      </div>

      <!-- 2-col grid of pseudo-select fields -->
      <div
        :style="{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '14px',
          marginTop: '20px',
        }"
      >
        <div v-for="field in fields" :key="field.label">
          <label
            class="block font-bold text-ink-soft"
            :style="{ fontSize: '12px', marginBottom: '6px' }"
          >
            {{ field.label }}
          </label>
          <div
            class="flex items-center justify-between bg-surface"
            :style="{
              padding: '10px 12px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--color-ink)',
              border: '1.5px solid var(--color-border-input)',
            }"
          >
            <span class="truncate">{{ field.options[0] }}</span>
            <span :style="{ color: 'var(--color-muted)', marginLeft: '8px' }">▾</span>
          </div>
        </div>
      </div>

      <!-- Time-slot chips -->
      <div :style="{ marginTop: '18px' }">
        <label class="block font-bold text-ink-soft" :style="{ fontSize: '12px', marginBottom: '8px' }">
          Time slot
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="slot in timeSlots"
            :key="slot"
            type="button"
            class="cursor-pointer font-bold"
            :style="
              selectedSlot === slot
                ? {
                    padding: '8px 14px',
                    borderRadius: '999px',
                    fontSize: '12.5px',
                    background: 'var(--color-tile-violet)',
                    color: 'var(--color-fg-violet)',
                    border: '1.5px solid var(--color-dashed)',
                  }
                : {
                    padding: '8px 14px',
                    borderRadius: '999px',
                    fontSize: '12.5px',
                    background: 'var(--color-surface-subtle)',
                    color: 'var(--color-ink-soft)',
                    border: '1.5px solid var(--color-border-input)',
                  }
            "
            @click="selectedSlot = slot"
          >
            {{ slot }}
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3" :style="{ marginTop: '24px' }">
        <AppButton variant="outline" @click="emit('close')">Cancel</AppButton>
        <AppButton variant="gradient" @click="emit('close')">Assign class ✓</AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hz-modal-card {
  animation: hz-modal-in 160ms ease-out;
}
@media (prefers-reduced-motion: reduce) {
  .hz-modal-card {
    animation: none;
  }
}
@keyframes hz-modal-in {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
