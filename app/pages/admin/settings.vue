<script setup lang="ts">
import StubScreen from '~/components/admin/StubScreen.vue'
import { useAdminMetrics } from '~/composables/useAdminMetrics'
import { formatRM } from '~/utils/money'

definePageMeta({ layout: 'admin' })
const m = useAdminMetrics()
const stats = [
  { icon: '👥', tone: 'amber' as const, value: String(m.adminAccounts), label: 'Akaun admin', sub: 'Akses penuh' },
  { icon: '💬', tone: 'green' as const, value: 'WhatsApp', label: 'Integrasi aktif', sub: 'Zoom, Microsoft akan datang' },
  { icon: '🏷️', tone: 'blue' as const, value: formatRM(m.defaultFee), label: 'Yuran lalai', sub: 'Sebulan' },
]
</script>

<template>
  <StubScreen
    title="Settings"
    malay="Tetapan"
    icon="⚙️"
    desc="Tetapan profil akademi, pengguna admin, kadar yuran lalai, dan integrasi WhatsApp, Zoom dan Microsoft akan berada di sini."
    :stats="stats"
  />
</template>
