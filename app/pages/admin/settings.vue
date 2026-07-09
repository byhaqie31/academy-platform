<script setup lang="ts">
import StubScreen from '~/components/admin/StubScreen.vue'
import { useAdminMetrics } from '~/composables/useAdminMetrics'
import { formatRM } from '~/utils/money'

definePageMeta({ layout: 'admin' })
const m = useAdminMetrics()
const stats = [
  { icon: '👥', tone: 'amber' as const, value: String(m.adminAccounts), label: 'Admin accounts', sub: 'Full access' },
  { icon: '💬', tone: 'green' as const, value: 'WhatsApp', label: 'Active integration', sub: 'Zoom, Microsoft coming soon' },
  { icon: '🏷️', tone: 'blue' as const, value: formatRM(m.defaultFee), label: 'Default fee', sub: 'Per month' },
]
</script>

<template>
  <StubScreen
    title="Settings"
    malay="Settings"
    icon="⚙️"
    desc="Academy profile settings, admin users, default fee rates, and WhatsApp, Zoom and Microsoft integrations will live here."
    :stats="stats"
  />
</template>
