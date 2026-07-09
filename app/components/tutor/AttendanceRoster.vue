<script setup lang="ts">
import { useAttendance } from '~/composables/useAttendance'
import IconTile from '~/components/ui/IconTile.vue'
import AttendanceSegmented from '~/components/tutor/AttendanceSegmented.vue'
import { toneByIndex } from '~/utils/tone'
import type { AttendanceStatus } from '~/types'

const props = defineProps<{ classId: string; roster: string[] }>()
const emit = defineEmits<{ change: [] }>()

const { statusOf, set } = useAttendance()

// The class level is uniform per class; carried in via the parent's roster
// rows. Each student inherits it. We read it from the class composable via prop.
const onSet = (student: string, status: AttendanceStatus) => {
  set(props.classId, student, status)
  emit('change')
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      v-for="(name, i) in props.roster"
      :key="name"
      class="flex items-center gap-3"
      :style="{
        padding: '11px 13px',
        borderRadius: '14px',
        border: '1px solid var(--color-divider)',
        background: 'var(--color-surface-subtle)',
      }"
    >
      <IconTile :icon="name.charAt(0)" :tone="toneByIndex(i)" :size="38" :radius="11" />
      <div class="min-w-0 flex-1">
        <div class="font-bold text-ink" style="font-size: 13.5px">{{ name }}</div>
        <slot name="level" :name="name" :index="i">
          <div class="text-muted" style="font-size: 11px; font-weight: 600">Student</div>
        </slot>
      </div>
      <AttendanceSegmented
        :status="statusOf(props.classId, name)"
        :student="name"
        @set="onSet(name, $event)"
      />
    </div>
  </div>
</template>
