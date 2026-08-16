<script setup lang="ts">
import { tutorNav } from '~/composables/usePortalNav'
import { tutorNotifications } from '~/composables/useNotifications'
import { useAcademy } from '~/composables/useAcademy'

const { academy } = useAcademy()
</script>

<template>
  <PortalShell
    :nav="tutorNav"
    base="/tutor"
    section-label="Tutor space"
    :brand-name="`${academy.shortName} Tutor`"
    :brand-tagline="academy.name"
    :profile="{ name: 'Cikgu Hafiz', sub: 'Matematik', initial: 'H', tone: 'pink' }"
    :notifications="tutorNotifications"
    avatar-initial="H"
    avatar-tone="pink"
  >
    <slot />
  </PortalShell>
</template>
