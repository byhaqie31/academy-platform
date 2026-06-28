<script setup lang="ts">
import StatCard from '~/components/ui/StatCard.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import type { PillTone } from '~/utils/status'

defineProps<{
  title: string
  malay: string
  icon: string
  desc: string
  stats: { icon: string; tone: PillTone; value: string; label: string; sub?: string }[]
}>()
</script>

<template>
  <div class="flex flex-col gap-6">
    <header>
      <h1 class="font-display font-bold text-ink" style="font-size: 30px; line-height: 1.1">
        {{ title }} <span class="text-muted">/ {{ malay }}</span>
      </h1>
    </header>

    <div class="grid gap-4 sm:grid-cols-3">
      <StatCard v-for="s in stats" :key="s.label" v-bind="s" />
    </div>

    <EmptyState :icon="icon" :title="`${malay} sedang dibina`" :desc="desc" />
  </div>
</template>
