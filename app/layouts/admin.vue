<script setup lang="ts">
import { adminNav } from '~/composables/usePortalNav'
import { adminNotifications } from '~/composables/useNotifications'
import { useAcademy } from '~/composables/useAcademy'

const { academy } = useAcademy()
</script>

<template>
  <PortalShell
    :nav="adminNav"
    base="/admin"
    section-label="Management"
    :brand-name="`${academy.shortName} Admin`"
    :brand-tagline="academy.name"
    :profile="{ name: 'Admin Hz', sub: 'Kota Warisan', initial: 'A', tone: 'violet' }"
    :notifications="adminNotifications"
    avatar-gradient
    avatar-initial="A"
  >
    <slot />
  </PortalShell>
</template>
