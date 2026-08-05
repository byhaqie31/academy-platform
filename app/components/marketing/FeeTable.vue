<script setup lang="ts">
import { useFees } from '~/composables/useFees'
import { formatRM } from '~/utils/money'

// Published price list, not a calculation. Amounts come pre-computed from the
// composable; nothing here is wired to an input.
const { tiers } = useFees()
</script>

<template>
  <!-- The table scrolls inside this box so the page itself never scrolls sideways at 390px. -->
  <div
    class="overflow-x-auto"
    :style="{
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-card)',
      background: 'var(--color-surface)',
    }"
  >
    <table style="width: 100%; border-collapse: collapse; min-width: 520px">
      <thead>
        <tr>
          <th
            v-for="(head, i) in ['Tahap', 'Setiap subjek, sebulan', 'Yuran']"
            :key="head"
            :style="{
              textAlign: i === 2 ? 'right' : 'left',
              fontSize: '12px',
              letterSpacing: '.09em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              padding: '16px 22px',
              background: 'var(--color-surface-lavender)',
              fontWeight: '800',
            }"
          >
            {{ head }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tier in tiers" :key="tier.stage">
          <td :style="{ padding: '16px 22px', borderTop: '1px solid var(--color-border)', fontSize: '15.5px' }">
            <b class="text-ink">{{ tier.title }}</b>
            <span class="block text-muted" style="font-size: 13.5px">{{ tier.levels }}</span>
          </td>
          <td
            :style="{
              padding: '16px 22px',
              borderTop: '1px solid var(--color-border)',
              fontSize: '15px',
              color: 'var(--color-muted)',
            }"
          >
            {{ tier.format }}
          </td>
          <td
            class="text-ink"
            :style="{
              padding: '16px 22px',
              borderTop: '1px solid var(--color-border)',
              fontSize: '15.5px',
              textAlign: 'right',
              fontWeight: '800',
              whiteSpace: 'nowrap',
            }"
          >
            {{ formatRM(tier.monthly) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
