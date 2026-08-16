<script setup lang="ts">
import StubScreen from '~/components/admin/StubScreen.vue'
import { useAdminMetrics } from '~/composables/useAdminMetrics'
import { formatRM } from '~/utils/money'

definePageMeta({ layout: 'admin' })
const m = useAdminMetrics()
const stats = [
  { icon: 'i-fluent-people-24-regular', tone: 'amber' as const, value: String(m.adminAccounts), label: 'Admin accounts', sub: 'Full access' },
  { icon: 'i-fluent-chat-24-regular', tone: 'green' as const, value: 'WhatsApp', label: 'Active integration', sub: 'Zoom, Microsoft coming soon' },
  { icon: 'i-fluent-tag-24-regular', tone: 'blue' as const, value: formatRM(m.defaultFee), label: 'Default fee', sub: 'Per month' },
]
</script>

<template>
  <StubScreen
    title="Settings"
    icon="i-fluent-settings-24-regular"
    desc="Academy profile settings, admin users, default fee rates, and WhatsApp, Zoom and Microsoft integrations will live here."
    :stats="stats"
  />
</template>
