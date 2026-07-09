<script setup lang="ts">
import type { AttendanceStatus } from '~/types'

const props = defineProps<{ status: AttendanceStatus; student: string }>()
const emit = defineEmits<{ set: [status: AttendanceStatus] }>()

// kind -> tone token suffix. present=green, late=amber, absent=overdue.
const TONE: Record<AttendanceStatus, string> = {
  present: 'green',
  late: 'amber',
  absent: 'overdue',
}

const BASE: Record<string, string> = {
  cursor: 'pointer',
  border: '1.5px solid',
  borderRadius: '10px',
  padding: '7px 11px',
  fontWeight: '700',
  fontSize: '11.5px',
  whiteSpace: 'nowrap',
}

const styleFor = (kind: AttendanceStatus) => {
  const active = props.status === kind
  const tone = TONE[kind]
  return {
    ...BASE,
    background: active ? `var(--color-tile-${tone})` : '#fff',
    borderColor: active ? `var(--color-fg-${tone})` : 'var(--color-border)',
    color: active ? `var(--color-fg-${tone})` : 'var(--color-faintest)',
  }
}

const BUTTONS: { kind: AttendanceStatus; label: string; aria: string }[] = [
  { kind: 'present', label: '✓ Present', aria: 'Present' },
  { kind: 'late', label: '◐ Late', aria: 'Late' },
  { kind: 'absent', label: '✕ Absent', aria: 'Absent' },
]
</script>

<template>
  <div
    role="group"
    :aria-label="`Attendance ${props.student}`"
    class="flex gap-1.5 shrink-0"
  >
    <button
      v-for="b in BUTTONS"
      :key="b.kind"
      type="button"
      :aria-pressed="props.status === b.kind"
      :aria-label="`${b.aria} ${props.student}`"
      :style="styleFor(b.kind)"
      @click="emit('set', b.kind)"
    >
      {{ b.label }}
    </button>
  </div>
</template>
