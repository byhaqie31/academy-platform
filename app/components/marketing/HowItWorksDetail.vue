<script setup lang="ts">
import CheckList from './CheckList.vue'
import InfoNote from './InfoNote.vue'
import { useSiteContent } from '~/composables/useSiteContent'

// The long-form explanation beside the "what you need" panel. This page exists
// to kill the biggest objection to an online centre, so the copy is plain and
// the claims are concrete.
const { howItWorks } = useSiteContent()
const need = howItWorks.whatYouNeed
</script>

<template>
  <div class="grid gap-12 lg:grid-cols-2 items-start">
    <CheckList :items="howItWorks.points" size="lg" />

    <div
      :style="{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-card)',
        padding: '30px',
        boxShadow: 'var(--shadow-card)',
      }"
    >
      <h3 class="font-display font-semibold text-ink" style="font-size: 19px; margin: 0 0 16px">
        {{ need.title }}
      </h3>
      <CheckList :items="need.items" />
      <InfoNote compact :note="{ lead: need.note }" style="margin-top: 22px" />
    </div>
  </div>
</template>
