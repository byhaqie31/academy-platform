<script setup lang="ts">
import { computed } from 'vue'
import { useCollection } from '~/composables/useCollection'
import { formatRM } from '~/utils/money'

// The 1st to the 7th is where the whole month gets collected, so the dashboard
// carries the cycle rather than making someone open another screen to see it.
const collection = useCollection()
const board = computed(() => collection.board)

const collectedPct = computed(() => {
  const b = board.value
  return b.familiesTotal ? Math.round((b.familiesPaid / b.familiesTotal) * 100) : 0
})
</script>

<template>
  <NuxtLink
    to="/admin/collection"
    class="no-underline bg-surface block"
    :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '20px' }"
  >
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <div class="font-display font-semibold text-ink" style="font-size: 17px">
          Collection week
        </div>
        <div class="text-muted" style="font-size: 12.5px; font-weight: 600; margin-top: 2px">
          Fees due on the 7th · access pauses on the 8th
        </div>
      </div>
      <span
        class="font-bold shrink-0"
        :style="{
          padding: '6px 13px',
          borderRadius: 'var(--radius-pill)',
          fontSize: '12px',
          background: 'var(--color-tile-amber)',
          color: 'var(--color-fg-amber)',
        }"
      >
        {{ board.daysLeft }} days left
      </span>
    </div>

    <div class="flex items-end justify-between gap-3 flex-wrap" style="margin-top: 16px">
      <div>
        <div class="font-display font-bold text-ink" style="font-size: 27px; line-height: 1.1">
          {{ formatRM(board.outstanding) }}
        </div>
        <div class="text-faint" style="font-size: 11.5px; font-weight: 600; margin-top: 3px">
          still to come in
        </div>
      </div>
      <div class="text-right">
        <div class="font-display font-bold" style="font-size: 27px; line-height: 1.1; color: var(--color-fg-overdue)">
          {{ board.projectedSuspensions }}
        </div>
        <div class="text-faint" style="font-size: 11.5px; font-weight: 600; margin-top: 3px">
          suspend on the 8th
        </div>
      </div>
    </div>

    <!-- Collected so far, as a share of families rather than ringgit: an admin
         chases families, not amounts. -->
    <div
      :style="{
        marginTop: '16px',
        height: '8px',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--color-tile-inactive)',
        overflow: 'hidden',
      }"
    >
      <div
        :style="{
          width: `${collectedPct}%`,
          height: '100%',
          borderRadius: 'var(--radius-pill)',
          background: 'var(--color-whatsapp)',
        }"
      />
    </div>
    <div class="flex items-center justify-between" style="margin-top: 8px">
      <span class="font-semibold text-ink-soft" style="font-size: 12px">
        {{ board.familiesPaid }} of {{ board.familiesTotal }} families paid
      </span>
      <span class="font-bold text-brand-deep" style="font-size: 12px">Open collection →</span>
    </div>
  </NuxtLink>
</template>
