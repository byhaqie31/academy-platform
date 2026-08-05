<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useStudents, type StudentFilter } from '~/composables/useStudents'
import { useAcademy } from '~/composables/useAcademy'
import { useSubjects } from '~/composables/useSubjects'

const emit = defineEmits<{ change: [filter: StudentFilter] }>()

const { branches } = useAcademy()
const students = useStudents()
const subjects = useSubjects()

// Distinct levels + subjects, derived from the seeded students so the dropdowns
// only ever offer values that actually match something.
const levels = computed(() => [...new Set(students.all.map((s) => s.level))])
const subjectNames = computed(() => [
  ...new Set(students.all.flatMap((s) => s.subjects)),
])

const state = reactive<StudentFilter>({ q: '', branchId: '', level: '', subject: '', pay: '' })

// Drop empty strings so the composable filter treats them as "no filter".
watch(
  state,
  () => {
    emit('change', {
      q: state.q || undefined,
      branchId: state.branchId || undefined,
      level: state.level || undefined,
      subject: state.subject || undefined,
      pay: state.pay || undefined,
    })
  },
  { deep: true },
)

const fieldStyle = {
  padding: '13px 15px',
  borderRadius: '13px',
  border: '1.5px solid var(--color-border-input)',
  backgroundColor: 'var(--color-surface-subtle)',
  fontSize: '14px',
  fontWeight: '600',
}
// Leave room on the right for the scoped chevron background-image.
const selectStyle = { ...fieldStyle, padding: '13px 36px 13px 15px' }
const subjLabel = (name: string) => subjects.byName(name)?.name ?? name
</script>

<template>
  <div class="grid gap-3 lg:grid-cols-[1.6fr_repeat(4,1fr)]">
    <input
      v-model="state.q"
      type="search"
      placeholder="🔍 Search student name…"
      class="text-ink w-full outline-none focus-visible:border-brand"
      :style="fieldStyle"
    />
    <select v-model="state.branchId" class="text-ink w-full outline-none cursor-pointer hz-select" :style="selectStyle">
      <option value="">All branches</option>
      <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.short }}</option>
    </select>
    <select v-model="state.level" class="text-ink w-full outline-none cursor-pointer hz-select" :style="selectStyle">
      <option value="">All levels</option>
      <option v-for="l in levels" :key="l" :value="l">{{ l }}</option>
    </select>
    <select v-model="state.subject" class="text-ink w-full outline-none cursor-pointer hz-select" :style="selectStyle">
      <option value="">All subjects</option>
      <option v-for="s in subjectNames" :key="s" :value="s">{{ subjLabel(s) }}</option>
    </select>
    <select v-model="state.pay" class="text-ink w-full outline-none cursor-pointer hz-select" :style="selectStyle">
      <option value="">All payments</option>
      <option value="Paid">Paid</option>
      <option value="Pending">Pending</option>
      <option value="Overdue">Overdue</option>
    </select>
  </div>
</template>

<style scoped>
.hz-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%238388A5' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
}
</style>
