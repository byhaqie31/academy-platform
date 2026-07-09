<script setup lang="ts">
import { useAdminMetrics } from '~/composables/useAdminMetrics'
import { formatRM } from '~/utils/money'

const m = useAdminMetrics()
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
          This month's margin
        </span>
        <div class="font-display font-bold mt-3" style="font-size: 52px; line-height: 1">
          {{ formatRM(m.margin) }}
        </div>
        <span
          class="inline-flex items-center gap-1 font-bold mt-3"
          :style="{ padding: '5px 11px', borderRadius: '999px', fontSize: '12px', background: 'rgba(52,199,123,.18)', color: '#5BE39B' }"
        >
          ↑ {{ m.marginPct }}% margin
        </span>
        <p class="mt-4" style="font-size: 13.5px; color: #B7B6D8; line-height: 1.6; max-width: 340px">
          Revenue {{ formatRM(m.revenue) }} minus tutor cost {{ formatRM(m.cost) }}. Healthy margin
          across {{ m.branchesActive }} branches for Jun 2026.
        </p>
      </div>

      <div>
        <div class="flex items-center justify-between mb-2" style="font-size: 11.5px; color: #B7B6D8; font-weight: 600">
          <span>Margin {{ m.marginPct }}%</span>
          <span>Cost {{ (100 - m.marginPct).toFixed(1) }}%</span>
        </div>
        <div class="overflow-hidden flex" :style="{ height: '14px', borderRadius: '999px', background: 'rgba(255,255,255,.12)' }">
          <div :style="{ width: m.marginPct + '%', background: 'var(--brand-gradient)' }" />
        </div>
        <div class="grid grid-cols-2 gap-3 mt-4">
          <div :style="{ background: 'rgba(255,255,255,.06)', borderRadius: '16px', padding: '14px' }">
            <div style="font-size: 10.5px; color: #B7B6D8; font-weight: 700; letter-spacing: 0.04em" class="uppercase">Margin</div>
            <div class="font-display font-bold mt-1" style="font-size: 22px">{{ formatRM(m.margin) }}</div>
          </div>
          <div :style="{ background: 'rgba(255,255,255,.06)', borderRadius: '16px', padding: '14px' }">
            <div style="font-size: 10.5px; color: #B7B6D8; font-weight: 700; letter-spacing: 0.04em" class="uppercase">Tutor cost</div>
            <div class="font-display font-bold mt-1" style="font-size: 22px">{{ formatRM(m.cost) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
