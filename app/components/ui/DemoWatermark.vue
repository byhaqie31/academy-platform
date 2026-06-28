<script setup lang="ts">
import { useAcademy } from '~/composables/useAcademy'

const { academy } = useAcademy()
</script>

<template>
  <a
    :href="`https://${academy.contact.web}`"
    target="_blank"
    rel="noopener"
    class="fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 font-bold no-underline transition-transform hover:-translate-y-px"
    :style="{
      padding: '8px 13px',
      borderRadius: '999px',
      fontSize: '11.5px',
      background: 'rgba(30,35,72,.86)',
      color: '#fff',
      boxShadow: 'var(--shadow-badge)',
      backdropFilter: 'blur(8px)',
    }"
  >
    <span style="font-size: 13px">✨</span>
    Live mockup by Axel Nova
  </a>
</template>
