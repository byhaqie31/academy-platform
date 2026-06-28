<script setup lang="ts">
import { tutorNav } from '~/composables/usePortalNav'
import { useAcademy } from '~/composables/useAcademy'

const { academy } = useAcademy()
</script>

<template>
  <PortalShell
    :nav="tutorNav"
    base="/tutor"
    section-label="Ruang tutor"
    :brand-name="`${academy.shortName} Tutor`"
    :brand-tagline="academy.name"
    :profile="{ name: 'Cikgu Hafiz', sub: 'Matematik · 2 cawangan', initial: 'H', tone: 'pink' }"
    avatar-initial="H"
    avatar-tone="pink"
  >
    <slot />
  </PortalShell>
</template>
