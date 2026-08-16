<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTonight, type SessionState, type TonightRow } from '~/composables/useTonight'
import StatCard from '~/components/ui/StatCard.vue'
import StatusPill from '~/components/ui/StatusPill.vue'
import AppButton from '~/components/ui/AppButton.vue'
import type { Day } from '~/types'
import type { PillTone } from '~/utils/status'
import { toneTile, toneFg } from '~/utils/tone'

definePageMeta({ layout: 'admin' })

const day = ref<Day>('Mon')
const board = useTonight()
const tonight = computed(() => board.forDay(day.value))
const toast = useToast()

// The two things an operator actually does at 7:30pm about an alert.
function resolve(row: TonightRow) {
  if (row.state === 'empty') {
    toast.add({
      title: `Calling ${row.tutor}`,
      description: `${row.cls.subject} · ${row.cls.cls} is still empty. A WhatsApp call is placed.`,
      icon: 'i-fluent-call-24-regular',
    })
    return
  }
  toast.add({
    title: 'Participants reviewed',
    description: `${row.alert} in ${row.cls.cls}. Anyone not on the paid roster is removed.`,
    icon: 'i-fluent-shield-24-regular',
    color: 'success',
  })
}

const days: { key: Day; label: string }[] = [
  { key: 'Mon', label: 'Mon' },
  { key: 'Tue', label: 'Tue' },
  { key: 'Wed', label: 'Wed' },
  { key: 'Thu', label: 'Thu' },
  { key: 'Fri', label: 'Fri' },
  { key: 'Sat', label: 'Sat' },
]

const stateTone = (s: SessionState): PillTone =>
  s === 'running' ? 'green' : s === 'starting' ? 'blue' : s === 'empty' ? 'overdue' : 'inactive'
const stateLabel = (s: SessionState): string =>
  s === 'running' ? 'Live' : s === 'starting' ? 'Starting' : s === 'empty' ? 'Empty' : 'Scheduled'
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h1 class="font-display font-bold text-ink" style="font-size: 30px; line-height: 1.1">
          Tonight
        </h1>
        <p class="text-muted mt-1" style="font-size: 14px">
          {{ tonight.totals.classes }} classes · {{ tonight.totals.expected }} students expected ·
          live from 7:30pm
        </p>
      </div>
      <div class="hz-scroll flex gap-1.5">
        <button
          v-for="d in days"
          :key="d.key"
          type="button"
          class="shrink-0 font-semibold transition-colors"
          :style="{
            padding: '7px 14px',
            borderRadius: '999px',
            fontSize: '12.5px',
            background: day === d.key ? 'var(--color-ink)' : 'var(--color-tile-inactive)',
            color: day === d.key ? '#fff' : 'var(--color-ink-soft)',
          }"
          @click="day = d.key"
        >
          {{ d.label }}
        </button>
      </div>
    </header>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard icon="i-fluent-video-24-regular" tone="violet" :value="String(tonight.totals.classes)" label="Rooms tonight" :sub="`${tonight.totals.peakUsed} at peak`" />
      <StatCard icon="i-fluent-ticket-diagonal-24-regular" tone="blue" :value="`${tonight.totals.peakUsed} / ${tonight.totals.licences}`" label="Licences in use" sub="1 licence = 1 room at a time" />
      <StatCard icon="i-fluent-hand-wave-24-regular" tone="green" :value="`${tonight.totals.joined} / ${tonight.totals.expected}`" label="Students joined" sub="live from webhooks" />
      <StatCard icon="i-fluent-warning-24-regular" tone="overdue" :value="String(tonight.totals.alerts)" label="Needs attention" :sub="`${tonight.totals.unknown} unknown participants`" />
    </div>

    <section
      v-for="slot in tonight.slots"
      :key="slot"
      class="bg-surface"
      :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '18px' }"
    >
      <div class="flex items-center justify-between gap-3" :style="{ marginBottom: '14px' }">
        <div class="font-display font-bold text-ink" :style="{ fontSize: '17px' }">{{ slot }}</div>
        <span class="font-semibold text-muted" :style="{ fontSize: '12.5px' }">
          {{ tonight.forSlot(slot).length }} {{ tonight.forSlot(slot).length === 1 ? 'room' : 'rooms' }}
          · {{ tonight.forSlot(slot).length }}
          {{ tonight.forSlot(slot).length === 1 ? 'licence' : 'licences' }} used
        </span>
      </div>

      <div class="flex flex-col" :style="{ gap: '10px' }">
        <div
          v-for="r in tonight.forSlot(slot)"
          :key="r.cls.id"
          class="flex items-center gap-3 flex-wrap"
          :style="{
            border: r.alert ? '1px solid var(--color-fg-overdue)' : '1px solid var(--color-divider)',
            background: r.alert ? 'var(--color-tile-overdue)' : 'var(--color-surface-subtle)',
            borderRadius: '14px',
            padding: '12px 14px',
          }"
        >
          <div
            class="grid place-items-center shrink-0 font-bold"
            :style="{
              width: '38px', height: '38px', borderRadius: '11px',
              background: toneTile(r.tone), color: toneFg(r.tone), fontSize: '12px',
            }"
          >
            {{ r.cls.subject.slice(0, 2) }}
          </div>

          <div class="min-w-0" style="flex: 1 1 200px">
            <div class="font-semibold text-ink truncate" :style="{ fontSize: '14px' }">
              {{ r.cls.subject }} · {{ r.cls.cls }}
            </div>
            <div class="text-muted truncate" :style="{ fontSize: '12.5px' }">
              {{ r.tutor }} · {{ r.host }}
            </div>
          </div>

          <div class="text-right shrink-0" :style="{ minWidth: '78px' }">
            <div class="font-display font-bold text-ink" :style="{ fontSize: '16px', lineHeight: '1.1' }">
              {{ r.joined }}/{{ r.expected }}
            </div>
            <div class="text-faint" :style="{ fontSize: '11px' }">joined</div>
          </div>

          <StatusPill :tone="stateTone(r.state)" :label="stateLabel(r.state)" />

          <div v-if="r.alert" class="flex items-center gap-2 shrink-0">
            <span class="font-bold" :style="{ color: 'var(--color-fg-overdue)', fontSize: '12.5px' }">
              {{ r.alert }}
            </span>
            <AppButton variant="dark" size="sm" @click="resolve(r)">
              {{ r.state === 'empty' ? 'Call tutor' : 'Review' }}
            </AppButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
