<script setup lang="ts">
import { usePortalDemo } from '~/composables/usePortalDemo'

// Demo control, not part of the product. It lets a walkthrough show every
// state of the billing cycle without waiting for a real month to pass.
const demo = usePortalDemo()
</script>

<template>
  <div
    class="bg-surface"
    :style="{ borderBottom: '1px solid var(--color-border-marketing)' }"
  >
    <div class="mx-auto" :style="{ maxWidth: '560px', padding: '10px 18px 11px' }">
      <div
        class="font-bold uppercase text-faint"
        :style="{ fontSize: '9.5px', letterSpacing: '0.07em', marginBottom: '7px' }"
      >
        Demo · kitaran bulanan
      </div>

      <div class="hz-scroll flex gap-1.5" :style="{ paddingBottom: '2px' }">
        <button
          v-for="s in demo.steps"
          :key="s.key"
          type="button"
          class="shrink-0 font-semibold transition-colors"
          :style="{
            padding: '6px 11px',
            borderRadius: '999px',
            fontSize: '11.5px',
            border: '1px solid transparent',
            background: demo.cycle.value === s.key ? 'var(--color-ink)' : 'var(--color-tile-inactive)',
            color: demo.cycle.value === s.key ? '#fff' : 'var(--color-ink-soft)',
          }"
          @click="demo.set(s.key)"
        >
          {{ s.day }} · {{ s.label }}
        </button>
      </div>

      <div class="text-faint" :style="{ fontSize: '11px', marginTop: '6px' }">
        {{ demo.stepFor(demo.cycle.value).hint }}
      </div>
    </div>
  </div>
</template>
