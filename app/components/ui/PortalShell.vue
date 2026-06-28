<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LogoMark from './LogoMark.vue'
import IconTile from './IconTile.vue'
import DemoWatermark from './DemoWatermark.vue'
import type { NavItem } from '~/composables/usePortalNav'
import type { PillTone } from '~/utils/status'
import { pillStyle } from '~/utils/status'

const props = defineProps<{
  nav: NavItem[]
  base: string
  sectionLabel: string
  brandName: string
  brandTagline: string
  profile: { name: string; sub: string; initial: string; tone: PillTone }
  avatarGradient?: boolean
  avatarInitial: string
  avatarTone?: PillTone
}>()

const route = useRoute()
const isActive = (to: string) =>
  to === props.base ? route.path === props.base : route.path.startsWith(to)
const activeItem = computed(
  () => [...props.nav].reverse().find((n) => isActive(n.to)) ?? props.nav[0],
)
</script>

<template>
  <div class="min-h-screen bg-bg-app md:flex">
    <!-- Desktop sidebar -->
    <aside
      class="hidden md:flex flex-col shrink-0 bg-surface sticky top-0 h-screen"
      :style="{ width: '248px', borderRight: '1px solid var(--color-border)', padding: '22px 16px' }"
    >
      <div class="flex items-center gap-3 px-2">
        <LogoMark :size="40" />
        <div class="min-w-0">
          <div class="font-display font-bold text-ink leading-tight" style="font-size: 16px">
            {{ brandName }}
          </div>
          <div
            class="uppercase font-bold text-faint"
            style="font-size: 10px; letter-spacing: 0.05em"
          >
            {{ brandTagline }}
          </div>
        </div>
      </div>

      <div
        class="uppercase font-bold text-faintest mt-6 mb-2 px-3"
        style="font-size: 10px; letter-spacing: 0.08em"
      >
        {{ sectionLabel }}
      </div>

      <nav class="flex flex-col gap-1">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 no-underline transition-colors"
          :style="{
            padding: '10px 12px',
            borderRadius: '13px',
            background: isActive(item.to) ? 'var(--color-tile-violet)' : 'transparent',
          }"
          :class="isActive(item.to) ? '' : 'hover:bg-[var(--color-bg-app)]'"
        >
          <span class="w-5 text-center" style="font-size: 16px">{{ item.icon }}</span>
          <span class="min-w-0">
            <span
              class="block font-bold leading-tight"
              :style="{ fontSize: '13.5px', color: isActive(item.to) ? 'var(--color-brand-deep)' : 'var(--color-ink-soft)' }"
            >
              {{ item.en }}
            </span>
            <span class="block font-semibold text-faintest" style="font-size: 10px">{{ item.ms }}</span>
          </span>
        </NuxtLink>
      </nav>

      <div class="mt-auto pt-4" :style="{ borderTop: '1px solid var(--color-divider)' }">
        <div class="flex items-center gap-3 px-1 mb-3">
          <IconTile :icon="profile.initial" :tone="profile.tone" :size="36" :radius="11" />
          <div class="min-w-0">
            <div class="font-bold text-ink truncate" style="font-size: 13px">{{ profile.name }}</div>
            <div class="font-semibold text-faint truncate" style="font-size: 11px">{{ profile.sub }}</div>
          </div>
        </div>
        <NuxtLink
          to="/"
          class="block text-center no-underline font-bold text-ink-soft transition-colors hover:text-ink"
          :style="{ padding: '10px', borderRadius: '12px', border: '1.5px solid var(--color-border-input)', fontSize: '12.5px' }"
        >
          ← Keluar ke laman web
        </NuxtLink>
      </div>
    </aside>

    <!-- Mobile top nav -->
    <div
      class="md:hidden sticky top-0 z-30 bg-surface"
      :style="{ borderBottom: '1px solid var(--color-border)' }"
    >
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-2">
          <LogoMark :size="34" />
          <span class="font-display font-bold text-ink" style="font-size: 15px">{{ brandName }}</span>
        </div>
        <NuxtLink to="/" class="text-ink-soft no-underline font-bold" style="font-size: 12px">← Laman web</NuxtLink>
      </div>
      <div class="hz-scroll px-3 pb-3 flex gap-2">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="shrink-0 no-underline font-bold whitespace-nowrap"
          :style="{
            padding: '8px 13px',
            borderRadius: '999px',
            fontSize: '12.5px',
            background: isActive(item.to) ? 'var(--color-ink)' : 'var(--color-tile-violet, #F3F1FA)',
            color: isActive(item.to) ? '#fff' : 'var(--color-ink-soft)',
          }"
        >
          {{ item.icon }} {{ item.en }}
        </NuxtLink>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <header
        class="sticky top-0 z-20 bg-surface hidden md:flex items-center gap-4"
        :style="{ borderBottom: '1px solid var(--color-border)', padding: '14px 30px' }"
      >
        <h1 class="font-display font-semibold text-ink" style="font-size: 16px">
          {{ activeItem?.en }}
        </h1>
        <div
          class="ml-auto flex items-center gap-2"
          :style="{ background: 'var(--color-bg-app)', borderRadius: '12px', padding: '9px 13px', width: '300px' }"
        >
          <span style="font-size: 14px">🔍</span>
          <input
            type="text"
            placeholder="Cari pelajar, kelas, tutor..."
            class="bg-transparent outline-none w-full text-text-body"
            style="font-size: 13px"
          />
        </div>
        <button
          class="relative grid place-items-center"
          aria-label="Notifikasi"
          :style="{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--color-bg-app)' }"
        >
          <span style="font-size: 16px">🔔</span>
          <span
            class="absolute"
            :style="{ top: '9px', right: '10px', width: '7px', height: '7px', borderRadius: '999px', background: 'var(--color-accent-pink)' }"
          />
        </button>
        <div
          v-if="avatarGradient"
          class="grid place-items-center font-bold text-white"
          :style="{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--brand-gradient)' }"
        >
          {{ avatarInitial }}
        </div>
        <IconTile v-else :icon="avatarInitial" :tone="avatarTone ?? 'pink'" :size="40" :radius="12" />
      </header>

      <main :style="{ padding: '28px 20px 80px' }">
        <div style="max-width: 1280px; margin: 0 auto">
          <slot />
        </div>
      </main>
    </div>

    <DemoWatermark />
  </div>
</template>
