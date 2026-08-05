<script setup lang="ts">
import { useSiteContent } from '~/composables/useSiteContent'

const { home } = useSiteContent()
</script>

<template>
  <section :style="{ background: 'var(--color-ink)' }">
    <div
      class="mx-auto flex flex-wrap items-center justify-center"
      :style="{ maxWidth: '1120px', padding: '18px 22px', gap: '10px 26px', color: 'var(--color-footer-text)' }"
    >
      <template v-for="(claim, i) in home.trustClaims" :key="claim">
        <span
          v-if="i > 0"
          aria-hidden="true"
          :style="{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--color-accent-pink)' }"
        />
        <b class="text-white" style="font-size: 14px">{{ claim }}</b>
      </template>
    </div>
  </section>
</template>
