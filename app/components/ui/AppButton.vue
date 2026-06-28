<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'gradient' | 'dark' | 'green' | 'soft' | 'outline' | 'whatsapp'
    to?: string
    size?: 'sm' | 'md'
    block?: boolean
  }>(),
  { variant: 'dark', size: 'md' },
)

const tag = computed(() => (props.to ? resolveComponent('NuxtLink') : 'button'))

const style = computed(() => {
  const base: Record<string, string> = {
    borderRadius: '13px',
    fontWeight: '800',
    fontSize: props.size === 'sm' ? '12.5px' : '14px',
    padding: props.size === 'sm' ? '9px 15px' : '12px 20px',
  }
  switch (props.variant) {
    case 'gradient':
      return { ...base, background: 'var(--brand-gradient)', color: '#fff', boxShadow: 'var(--shadow-cta)' }
    case 'green':
      return { ...base, background: 'var(--green-gradient)', color: '#fff', boxShadow: 'var(--shadow-wa)' }
    case 'whatsapp':
      return { ...base, background: '#25D366', color: '#fff', boxShadow: 'var(--shadow-wa)' }
    case 'soft':
      return { ...base, background: 'var(--color-tile-violet)', color: 'var(--color-fg-violet)', fontWeight: '700' }
    case 'outline':
      return { ...base, background: '#fff', color: 'var(--color-ink-soft)', border: '1.5px solid var(--color-border-input)', fontWeight: '700' }
    default:
      return { ...base, background: 'var(--color-ink)', color: '#fff', fontWeight: '700' }
  }
})
</script>

<template>
  <component
    :is="tag"
    :to="to"
    class="inline-flex items-center justify-center gap-2 cursor-pointer transition-transform duration-150 hover:-translate-y-px active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    :class="{ 'w-full': block }"
    :style="style"
  >
    <slot />
  </component>
</template>
