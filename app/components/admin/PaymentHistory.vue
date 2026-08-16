<script setup lang="ts">
import { computed } from 'vue'
import { useBilling } from '~/composables/useBilling'
import StatusPill from '~/components/ui/StatusPill.vue'
import { formatRM } from '~/utils/money'
import { payTone } from '~/utils/status'

const props = defineProps<{ studentId: string }>()

const rows = computed(() => useBilling().paymentHistory(props.studentId))
// The monthly fee is the amount on the most recent invoice row.
const fee = computed(() => rows.value[0]?.amount ?? 0)
</script>

<template>
  <section
    class="bg-surface"
    :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '22px' }"
  >
    <div class="flex items-center justify-between mb-4">
      <h2 class="font-display font-semibold text-ink" style="font-size: 17px">Payment history</h2>
      <span class="text-faint" style="font-size: 12px; font-weight: 600">
        Fee {{ formatRM(fee) }} / month
      </span>
    </div>

    <div class="flex flex-col gap-2.5">
      <div
        v-for="(p, i) in rows"
        :key="i"
        class="flex items-center gap-3.5"
        :style="{ padding: '11px 13px', borderRadius: '14px', border: '1px solid var(--color-divider)' }"
      >
        <div
          class="grid place-items-center shrink-0"
          :style="{
            width: '46px',
            height: '36px',
            borderRadius: '8px',
            fontSize: '13px',
            border: '1px solid var(--color-border-input)',
            background:
              'repeating-linear-gradient(45deg, #F3EEFF, #F3EEFF 6px, #ECE5FF 6px, #ECE5FF 12px)',
          }"
        >
          <UIcon v-if="p.hasProof" name="i-fluent-receipt-20-regular" :style="{ width: '16px', height: '16px' }" />
          <template v-else>—</template>
        </div>
        <div class="min-w-0 flex-1">
          <div class="font-bold text-ink" style="font-size: 13px">Invoice {{ p.period }}</div>
          <div class="text-faint truncate" style="font-size: 11.5px; font-weight: 600">
            {{ p.proofLabel }}
          </div>
        </div>
        <span class="font-display font-bold text-ink shrink-0" style="font-size: 13.5px">
          {{ formatRM(p.amount) }}
        </span>
        <StatusPill :tone="payTone(p.status)" :label="p.status" />
      </div>
    </div>
  </section>
</template>
