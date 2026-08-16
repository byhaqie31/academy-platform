<script setup lang="ts">
import { computed } from 'vue'
import { useTonight } from '~/composables/useTonight'
import { useGreeting } from '~/composables/useGreeting'

// A glance at the evening's operations. The detail lives on /admin/tonight;
// this only answers "is anything wrong right now".
const tonight = useTonight()
const { today } = useGreeting()

const day = computed(() => tonight.teachingDayFrom(today.value))
const view = computed(() => tonight.forDay(day.value))
const totals = computed(() => view.value.totals)
</script>

<template>
  <NuxtLink
    to="/admin/tonight"
    class="no-underline block"
    :style="{
      background: 'var(--hero-dark-gradient)',
      borderRadius: '20px',
      padding: '20px',
      boxShadow: 'var(--shadow-revenue)',
    }"
  >
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <div class="font-bold uppercase" :style="{ color: 'var(--color-footer-faint)', fontSize: '10.5px', letterSpacing: '0.08em' }">
          Tonight · {{ day }} · live from 7:30pm
        </div>
        <div class="font-display font-bold" :style="{ color: '#fff', fontSize: '22px', lineHeight: '1.15', marginTop: '4px' }">
          {{ totals.classes }} rooms · {{ totals.joined }} of {{ totals.expected }} joined
        </div>
      </div>
      <span
        v-if="totals.alerts"
        class="font-bold shrink-0"
        :style="{
          padding: '6px 13px',
          borderRadius: 'var(--radius-pill)',
          fontSize: '12px',
          background: 'rgba(255,255,255,.12)',
          color: 'var(--color-accent-pink)',
        }"
      >
        {{ totals.alerts }} need attention
      </span>
      <span
        v-else
        class="font-bold shrink-0"
        :style="{
          padding: '6px 13px',
          borderRadius: 'var(--radius-pill)',
          fontSize: '12px',
          background: 'rgba(255,255,255,.12)',
          color: 'var(--color-whatsapp-soft)',
        }"
      >
        All rooms healthy
      </span>
    </div>

    <div class="grid gap-3" style="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); margin-top: 16px">
      <div
        v-for="s in [
          { label: 'Licences at peak', value: `${totals.peakUsed} / ${totals.licences}` },
          { label: 'Students expected', value: String(totals.expected) },
          { label: 'Unknown in rooms', value: String(totals.unknown) },
        ]"
        :key="s.label"
        :style="{ background: 'rgba(255,255,255,.07)', borderRadius: '14px', padding: '11px 13px' }"
      >
        <div class="font-display font-bold" :style="{ color: '#fff', fontSize: '18px', lineHeight: '1.1' }">
          {{ s.value }}
        </div>
        <div class="font-semibold" :style="{ color: 'var(--color-footer-muted)', fontSize: '11px', marginTop: '3px' }">
          {{ s.label }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
