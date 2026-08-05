<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'gradient' | 'dark' | 'green' | 'soft' | 'outline' | 'whatsapp'
    to?: string
    size?: 'sm' | 'md' | 'lg'
    block?: boolean
    /** Pill radius. The marketing website uses pills throughout; portals do not. */
    pill?: boolean
    /** A file or off-site URL: renders a plain anchor, not a router link. */
    external?: boolean
  }>(),
  { variant: 'dark', size: 'md' },
)

const tag = computed(() => {
  if (props.external) return 'a'
  return props.to ? resolveComponent('NuxtLink') : 'button'
})

// NuxtLink takes `to`; a plain anchor takes `href`. Passing `to` to an <a>
// silently renders a link that goes nowhere.
const linkAttrs = computed(() =>
  props.external
    ? { href: props.to, target: '_blank', rel: 'noopener' }
    : { to: props.to },
)

const SIZES = {
  sm: { fontSize: '12.5px', padding: '9px 15px' },
  md: { fontSize: '14px', padding: '12px 20px' },
  lg: { fontSize: '16px', padding: '16px 30px' },
} as const

const style = computed(() => {
  const base: Record<string, string> = {
    borderRadius: props.pill ? 'var(--radius-pill)' : '13px',
    fontWeight: '800',
    ...SIZES[props.size],
  }
  switch (props.variant) {
    case 'gradient':
      return { ...base, background: 'var(--brand-gradient)', color: '#fff', boxShadow: 'var(--shadow-cta)' }
    case 'green':
      return { ...base, background: 'var(--green-gradient)', color: '#fff', boxShadow: 'var(--shadow-wa)' }
    case 'whatsapp':
      return { ...base, background: 'var(--color-whatsapp)', color: '#fff', boxShadow: 'var(--shadow-wa)' }
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
    v-bind="linkAttrs"
    class="inline-flex items-center justify-center gap-2 cursor-pointer transition-transform duration-150 hover:-translate-y-px active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50 disabled:pointer-events-none"
    :class="{ 'w-full': block }"
    :style="style"
  >
    <slot />
  </component>
</template>
