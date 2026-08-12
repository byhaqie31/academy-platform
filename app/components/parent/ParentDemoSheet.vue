<script setup lang="ts">
import { ref } from 'vue'

// Demo control, not part of the product. Mobile variant: a floating pill that
// opens a bottom sheet with the cycle steps. The pill sits bottom-left
// because DemoWatermark owns the bottom-right corner.
const open = ref(false)
</script>

<template>
  <div class="lg:hidden">
    <button
      type="button"
      class="fixed font-semibold"
      :style="{
        left: '16px',
        bottom: '16px',
        zIndex: 60,
        background: 'var(--color-ink)',
        color: '#fff',
        borderRadius: '999px',
        padding: '10px 16px',
        fontSize: '12.5px',
        boxShadow: '0 10px 24px rgba(30,35,72,.28)',
      }"
      @click="open = true"
    >
      🎬 Demo
    </button>

    <div v-if="open" class="fixed inset-0" :style="{ zIndex: 70 }">
      <div
        class="absolute inset-0"
        :style="{ background: 'rgba(30,35,72,.45)' }"
        @click="open = false"
      />
      <div
        class="absolute bg-surface"
        :style="{
          left: 0,
          right: 0,
          bottom: 0,
          margin: '0 auto',
          maxWidth: '560px',
          borderRadius: '22px 22px 0 0',
          padding: '18px 18px 26px',
          boxShadow: '0 -12px 32px rgba(30,35,72,.18)',
        }"
      >
        <div class="flex items-center justify-between" :style="{ marginBottom: '12px' }">
          <div
            class="font-bold uppercase text-faint"
            :style="{ fontSize: '9.5px', letterSpacing: '0.07em' }"
          >
            Demo · kitaran bulanan
          </div>
          <button
            type="button"
            class="font-semibold text-muted"
            :style="{ fontSize: '12px', padding: '4px 8px' }"
            @click="open = false"
          >
            ✕
          </button>
        </div>
        <ParentDemoStepList @selected="open = false" />

        <NuxtLink
          to="/demo"
          class="block text-center font-semibold no-underline text-muted"
          :style="{ fontSize: '12.5px', marginTop: '16px' }"
        >
          ← Keluar demo
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
