<script setup lang="ts">
defineProps<{ icon: string; title: string; desc?: string }>()
</script>

<template>
  <div
    class="bg-surface grid place-items-center text-center"
    :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '60px 30px' }"
  >
    <div
      class="grid place-items-center mb-4"
      :style="{
        width: '72px',
        height: '72px',
        borderRadius: '18px',
        fontSize: '32px',
        background: 'var(--dashed-stripes)',
        border: '2px dashed var(--color-dashed)',
      }"
    >
      {{ icon }}
    </div>
    <h3 class="font-display font-semibold text-ink" style="font-size: 20px">{{ title }}</h3>
    <p v-if="desc" class="text-muted mt-2 max-w-md" style="font-size: 13.5px; line-height: 1.6">
      {{ desc }}
    </p>
    <span
      class="mt-4 font-bold"
      :style="{
        padding: '6px 14px',
        borderRadius: '999px',
        fontSize: '12px',
        background: 'var(--color-tile-amber)',
        color: 'var(--color-fg-amber)',
      }"
    >
      Coming soon
    </span>
  </div>
</template>
