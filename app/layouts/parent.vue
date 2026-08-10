<script setup lang="ts">
import { useAcademy } from '~/composables/useAcademy'
import { useParentPortal } from '~/composables/useParentPortal'

const { academy } = useAcademy()
const parent = useParentPortal()
</script>

<template>
  <div :style="{ background: 'var(--color-bg-app)', minHeight: '100vh' }">
    <header
      class="sticky top-0 z-50 bg-surface"
      :style="{ borderBottom: '1px solid var(--color-border-marketing)' }"
    >
      <div
        class="mx-auto flex items-center justify-between gap-3"
        :style="{ maxWidth: '560px', padding: '11px 18px' }"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <LogoMark :size="34" />
          <div class="min-w-0">
            <div
              class="font-display font-bold text-ink truncate"
              :style="{ fontSize: '14.5px', lineHeight: '1.15' }"
            >
              {{ academy.name }}
            </div>
            <div class="font-bold uppercase text-faint" :style="{ fontSize: '9.5px', letterSpacing: '0.06em' }">
              Portal ibu bapa
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <IconTile :icon="parent.child.first.charAt(0)" tone="pink" :size="32" :radius="999" />
          <NuxtLink
            to="/demo"
            class="font-semibold text-muted hover:text-ink transition-colors"
            :style="{ fontSize: '12px' }"
          >
            Keluar
          </NuxtLink>
        </div>
      </div>
    </header>

    <ParentDemoStateBar />

    <main :style="{ background: 'linear-gradient(180deg, #FBF8FF, #FFFFFF 320px)' }">
      <div class="mx-auto" :style="{ maxWidth: '560px', padding: '18px 18px 64px' }">
        <slot />
      </div>
    </main>

    <DemoWatermark />
  </div>
</template>
