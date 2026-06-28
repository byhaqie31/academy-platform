<script setup lang="ts">
import { formatRM } from '~/utils/money'

// Money is pre-computed upstream (usePayroll). The hero only formats it.
defineProps<{ hours: number; rate: number; amount: number }>()
</script>

<template>
  <div
    class="relative overflow-hidden text-white"
    :style="{ background: 'var(--hero-dark-gradient)', borderRadius: '24px', padding: '28px', boxShadow: 'var(--shadow-revenue)' }"
  >
    <div
      class="absolute pointer-events-none"
      :style="{ top: '-60px', right: '-40px', width: '260px', height: '260px', borderRadius: '999px', background: 'radial-gradient(circle, rgba(255,122,168,.28), transparent 70%)' }"
    />
    <div
      class="absolute pointer-events-none"
      :style="{ bottom: '-80px', left: '20%', width: '300px', height: '300px', borderRadius: '999px', background: 'radial-gradient(circle, rgba(139,108,240,.25), transparent 70%)' }"
    />

    <div class="relative grid gap-8 lg:grid-cols-[1.1fr_1fr] items-center">
      <div>
        <span
          class="inline-flex items-center uppercase font-bold"
          :style="{ padding: '6px 12px', borderRadius: '999px', fontSize: '10.5px', letterSpacing: '0.06em', background: 'rgba(255,255,255,.1)', color: '#D8D5F2' }"
        >
          Pendapatan Jun 2026
        </span>
        <div class="font-display font-bold mt-3" style="font-size: 52px; line-height: 1">
          {{ formatRM(amount) }}
        </div>
        <span
          class="inline-flex items-center gap-1 font-bold mt-3"
          :style="{ padding: '5px 11px', borderRadius: '999px', fontSize: '12px', background: 'rgba(52,199,123,.18)', color: '#5BE39B' }"
        >
          ↑ 4 jam dari Mei
        </span>
        <p class="mt-4" style="font-size: 13.5px; color: #B7B6D8; line-height: 1.6; max-width: 340px">
          {{ hours }} jam × {{ formatRM(rate) }}/jam · Dibayar 5 Julai 2026
        </p>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div :style="{ background: 'rgba(255,255,255,.06)', borderRadius: '16px', padding: '14px' }">
          <div style="font-size: 10.5px; color: #B7B6D8; font-weight: 700; letter-spacing: 0.04em" class="uppercase">Jam direkod</div>
          <div class="font-display font-bold mt-1" style="font-size: 22px">{{ hours }} j</div>
        </div>
        <div :style="{ background: 'rgba(255,255,255,.06)', borderRadius: '16px', padding: '14px' }">
          <div style="font-size: 10.5px; color: #B7B6D8; font-weight: 700; letter-spacing: 0.04em" class="uppercase">Kadar</div>
          <div class="font-display font-bold mt-1" style="font-size: 22px">{{ formatRM(rate) }}/jam</div>
        </div>
      </div>
    </div>
  </div>
</template>
