<script setup lang="ts">
import DemoNav from '~/components/ui/DemoNav.vue'

// DemoNav is mounted here rather than in each layout so it also rides on top of
// the frozen /v1 archive without any file under app/components/v1 being edited.
// It suppresses itself on /demo and on the landing pages.
</script>

<template>
  <!-- UApp provides the toast outlet the walkthrough actions confirm through. -->
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <DemoNav />
  </UApp>
</template>
