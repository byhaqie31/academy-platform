<script setup lang="ts">
import { toneTile, toneFg } from '~/utils/tone'
import { dayMs } from '~/utils/day'
import type { ParentClassRow } from '~/composables/useParentPortal'

defineProps<{ row: ParentClassRow; showJoin?: boolean }>()
</script>

<template>
  <div
    class="flex flex-col gap-3"
    :style="{
      background: row.live ? 'var(--color-surface-lavender)' : 'transparent',
      border: row.live ? '1px solid var(--color-border-input)' : '1px solid transparent',
      borderRadius: '16px',
      padding: row.live ? '13px' : '4px 0',
    }"
  >
    <div class="flex items-center gap-3">
      <div
        class="grid place-items-center shrink-0 font-bold"
        :style="{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: toneTile(row.tone),
          color: toneFg(row.tone),
          fontSize: '13px',
        }"
      >
        {{ row.subject.slice(0, 2) }}
      </div>

      <div class="min-w-0 flex-1">
        <div class="font-semibold text-ink truncate" :style="{ fontSize: '14.5px' }">
          {{ row.subject }}
        </div>
        <div class="text-muted truncate" :style="{ fontSize: '12.5px', marginTop: '1px' }">
          {{ showJoin ? row.tutor : dayMs(row.cls.day) }} · {{ row.cls.time }}
        </div>
      </div>

      <StatusPill
        v-if="row.today && !showJoin"
        tone="green"
        label="Hari ini"
      />
    </div>

    <ParentJoinButton v-if="showJoin" :row="row" />
  </div>
</template>
