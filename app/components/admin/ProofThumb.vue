<script setup lang="ts">
// Small striped "receipt" thumbnail shown when a payment proof exists.
// Presentational only, no upload logic.
</script>

<template>
  <div
    class="inline-grid place-items-center shrink-0"
    :style="{
      width: '44px',
      height: '34px',
      borderRadius: '8px',
      fontSize: '15px',
      border: '1px solid var(--color-border-input)',
      background:
        'repeating-linear-gradient(45deg, var(--color-tile-violet), var(--color-tile-violet) 5px, #ECE5FF 5px, #ECE5FF 10px)',
    }"
  >
    🧾
  </div>
</template>
