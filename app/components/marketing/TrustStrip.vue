<script setup lang="ts">
import TrustMarquee from '~/components/ui/TrustMarquee.vue'
import { useSiteContent } from '~/composables/useSiteContent'

const { home } = useSiteContent()
</script>

<template>
  <!-- Scrolls itself only where the claims do not fit, which on this page means
       phones. On a desktop width they sit on one centred line and nothing moves. -->
  <TrustMarquee :claims="home.trustClaims" />
</template>
