<script setup lang="ts">
// Demo control, not part of the product. Desktop sidebar variant; the layout
// shows it only at lg+ and gives it the 260px column.
</script>

<template>
  <div class="sticky" :style="{ top: '76px' }">
    <div
      class="bg-surface"
      :style="{
        border: '1px solid var(--color-border-marketing)',
        borderRadius: '20px',
        padding: '16px',
        boxShadow: '0 10px 28px rgba(30,35,72,.06)',
      }"
    >
      <div
        class="font-bold uppercase text-faint"
        :style="{ fontSize: '9.5px', letterSpacing: '0.07em', marginBottom: '10px' }"
      >
        Demo · kitaran bulanan
      </div>
      <ParentDemoStepList />
    </div>
  </div>
</template>
