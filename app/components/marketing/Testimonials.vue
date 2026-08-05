<script setup lang="ts">
import SectionHeading from '~/components/ui/SectionHeading.vue'
import { useSiteContent } from '~/composables/useSiteContent'
import { toneFg } from '~/utils/tone'
import type { SiteTestimonial } from '~/types'

// Optional `items` so spec B's landing pages can pass a campaign's chosen
// subset. Defaults to the full website set.
const props = defineProps<{ items?: SiteTestimonial[] }>()
const { testimonials, testimonialsSection } = useSiteContent()
const list = computed<SiteTestimonial[]>(() => props.items ?? testimonials)
</script>

<template>
  <section class="mx-auto" style="max-width: 1120px; padding: 0 22px 76px">
    <SectionHeading
      center
      :label="testimonialsSection.eyebrow"
      :title="testimonialsSection.title"
      class="mb-11"
    />

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px">
      <figure
        v-for="t in list"
        :key="t.id"
        :style="{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
          padding: '26px',
          boxShadow: 'var(--shadow-card)',
          margin: '0',
        }"
      >
        <blockquote class="text-text-body" style="font-size: 15.5px; line-height: 1.65; margin: 0">
          “{{ t.quote }}”
        </blockquote>
        <figcaption class="flex items-center gap-3" style="margin-top: 18px">
          <span
            class="grid place-items-center font-display font-semibold text-white shrink-0"
            :style="{ width: '40px', height: '40px', borderRadius: '50%', fontSize: '15px', background: toneFg(t.tone) }"
            aria-hidden="true"
          >
            {{ t.name.split(' ').slice(-1)[0]?.charAt(0) }}
          </span>
          <span>
            <b class="block text-ink" style="font-size: 15px">{{ t.name }}</b>
            <span class="block text-muted" style="font-size: 13px">{{ t.meta }}</span>
          </span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>
