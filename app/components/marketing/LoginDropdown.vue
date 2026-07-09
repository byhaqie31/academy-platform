<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import IconTile from '~/components/ui/IconTile.vue'

const open = ref(false)
const root = ref<HTMLElement | null>(null)

function onDocClick(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})

const portals = [
  { to: '/admin', icon: '🛠️', tone: 'violet' as const, title: 'Admin dashboard', sub: 'Manage students, classes, and payments' },
  { to: '/tutor', icon: '🧑‍🏫', tone: 'pink' as const, title: 'Tutor portal', sub: 'Schedule, attendance, and pay' },
  { to: '/portal/parents', icon: '👨‍👩‍👧', tone: 'green' as const, title: 'Parent portal', sub: "See your child's info and schedule" },
]
</script>

<template>
  <div ref="root" class="relative">
    <button
      class="inline-flex items-center gap-2 font-bold text-ink cursor-pointer"
      :style="{ padding: '9px 16px', borderRadius: '999px', background: '#fff', border: '1.5px solid var(--color-border-input)', fontSize: '13.5px' }"
      :aria-expanded="open"
      @click="open = !open"
    >
      🔐 Log in
      <span :style="{ transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }">▾</span>
    </button>

    <div
      v-if="open"
      class="absolute right-0 mt-2 bg-surface hz-pop z-50"
      :style="{ width: '248px', borderRadius: '18px', boxShadow: 'var(--shadow-dropdown)', padding: '10px' }"
    >
      <div
        class="uppercase font-bold text-faintest px-3 py-2"
        style="font-size: 10px; letter-spacing: 0.08em"
      >
        Choose a portal
      </div>
      <NuxtLink
        v-for="p in portals"
        :key="p.to"
        :to="p.to"
        class="flex items-center gap-3 no-underline transition-colors hover:bg-[var(--color-surface-lavender)]"
        :style="{ padding: '10px', borderRadius: '12px' }"
        @click="open = false"
      >
        <IconTile :icon="p.icon" :tone="p.tone" :size="38" :radius="11" />
        <span class="min-w-0">
          <span class="block font-bold text-ink" style="font-size: 13.5px">{{ p.title }}</span>
          <span class="block font-semibold text-faint" style="font-size: 11.5px">{{ p.sub }}</span>
        </span>
      </NuxtLink>
    </div>
  </div>
</template>
