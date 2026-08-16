<script setup lang="ts">
import { useAcademy } from '~/composables/useAcademy'

const { academy } = useAcademy()
</script>

<template>
  <a
    :href="`https://${academy.contact.web}`"
    target="_blank"
    rel="noopener"
    class="fixed bottom-4 right-4 z-40 hidden lg:inline-flex items-center gap-2 font-bold no-underline opacity-40 hover:opacity-100 focus-visible:opacity-100 transition-all duration-200 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    :style="{
      padding: '8px 13px',
      borderRadius: 'var(--radius-pill)',
      fontSize: '11.5px',
      background: 'rgba(30,35,72,.86)',
      color: '#fff',
      boxShadow: 'var(--shadow-badge)',
      backdropFilter: 'blur(8px)',
    }"
  >
    <UIcon name="i-fluent-sparkle-16-regular" :style="{ width: '13px', height: '13px' }" />
    Live mockup by Axel Nova
  </a>
</template>
