<script setup lang="ts">
import { useAcademy } from '~/composables/useAcademy'

const { academy } = useAcademy()
withDefaults(defineProps<{ size?: number }>(), { size: 40 })
</script>

<template>
  <div
    class="grid place-items-center font-display font-bold text-white shrink-0"
    :style="{
      width: size + 'px',
      height: size + 'px',
      borderRadius: '13px',
      background: 'var(--brand-gradient)',
      boxShadow: 'var(--shadow-logo)',
      fontSize: size * 0.45 + 'px',
    }"
  >
    {{ academy.logoText }}
  </div>
</template>
