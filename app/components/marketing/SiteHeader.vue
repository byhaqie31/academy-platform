<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import LogoMark from '~/components/ui/LogoMark.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { useAcademy } from '~/composables/useAcademy'
import { useSiteNav } from '~/composables/useSiteNav'

// No login here, deliberately. A visitor arriving from an ad should see a page
// selling classes, not a login form. The portal door is in the footer.
const { academy } = useAcademy()
const { items, cta, brandSub } = useSiteNav()

const open = ref(false)
const route = useRoute()
watch(() => route.path, () => (open.value = false))
</script>

<template>
  <header
    class="sticky top-0 z-40"
    :style="{
      background: 'rgba(255,255,255,.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--color-border-marketing)',
    }"
  >
    <div
      class="mx-auto flex items-center gap-5"
      style="max-width: 1120px; padding: 13px 22px"
    >
      <NuxtLink to="/" class="flex items-center gap-3 no-underline shrink-0">
        <LogoMark :size="40" />
        <span>
          <span class="block font-display font-bold text-ink" style="font-size: 18px">
            {{ academy.name }}
          </span>
          <span
            class="block text-muted font-bold"
            style="font-size: 10px; letter-spacing: .16em; text-transform: uppercase; margin-top: -2px"
          >
            {{ brandSub }}
          </span>
        </span>
      </NuxtLink>

      <nav class="ml-auto hidden lg:flex items-center gap-1">
        <NuxtLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="no-underline font-bold text-ink-soft transition-colors hover:text-brand-deep"
          active-class="text-brand-deep"
          :style="{ padding: '9px 13px', borderRadius: 'var(--radius-pill)', fontSize: '14px' }"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="ml-auto lg:ml-0 flex items-center gap-2.5">
        <!-- Wrapper carries the breakpoint: AppButton sets display on its own
             root, so a `hidden` passed in as a class would not win. -->
        <span class="hidden sm:block">
          <AppButton :to="cta.to" variant="gradient" pill class="whitespace-nowrap">
            {{ cta.label }}
          </AppButton>
        </span>
        <button
          type="button"
          class="lg:hidden grid place-items-center text-ink"
          :aria-expanded="open"
          aria-controls="site-menu"
          :aria-label="open ? 'Tutup menu' : 'Buka menu'"
          :style="{
            width: '42px',
            height: '42px',
            borderRadius: '13px',
            border: '1.5px solid var(--color-border-input)',
            fontSize: '17px',
          }"
          @click="open = !open"
        >
          {{ open ? '✕' : '☰' }}
        </button>
      </div>
    </div>

    <nav
      v-show="open"
      id="site-menu"
      class="lg:hidden"
      :style="{ borderTop: '1px solid var(--color-border-marketing)', background: 'var(--color-surface)' }"
    >
      <div class="mx-auto flex flex-col" style="max-width: 1120px; padding: 10px 16px 16px">
        <NuxtLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="no-underline font-bold text-ink-soft"
          active-class="text-brand-deep"
          :style="{ padding: '13px 12px', borderRadius: '13px', fontSize: '15px' }"
        >
          {{ item.label }}
        </NuxtLink>
        <span class="block sm:hidden mt-2">
          <AppButton :to="cta.to" variant="gradient" pill block>
            {{ cta.label }}
          </AppButton>
        </span>
      </div>
    </nav>
  </header>
</template>
