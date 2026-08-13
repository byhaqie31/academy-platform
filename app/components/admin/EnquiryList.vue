<script setup lang="ts">
import { computed, ref } from 'vue'
import { useEnquiries, type EnquiryFilter } from '~/composables/useEnquiries'
import IconTile from '~/components/ui/IconTile.vue'
import { sourceTone, sourceIcon, pillStyle } from '~/utils/status'
import { toneByIndex } from '~/utils/tone'

const enquiries = useEnquiries()
const filter = ref<EnquiryFilter>('all')
const filters: { key: EnquiryFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'pending', label: 'Pending' },
  { key: 'week', label: 'This week' },
]
const rows = computed(() => enquiries.filter(filter.value))
</script>

<template>
  <section
    class="bg-surface"
    :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '20px' }"
  >
    <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
      <h2 class="font-display font-semibold text-ink" style="font-size: 16px">Enquiries from ads</h2>
      <div class="flex gap-1.5">
        <button
          v-for="f in filters"
          :key="f.key"
          class="font-bold cursor-pointer transition-colors"
          :style="{
            padding: '6px 12px',
            borderRadius: '999px',
            fontSize: '11.5px',
            background: filter === f.key ? 'var(--color-ink)' : 'var(--color-tile-inactive)',
            color: filter === f.key ? '#fff' : 'var(--color-ink-soft)',
          }"
          @click="filter = f.key"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <ul class="flex flex-col gap-2.5">
      <li
        v-for="(e, i) in rows"
        :key="e.id"
        class="flex items-center gap-3"
        :style="{ background: 'var(--color-surface-subtle)', borderRadius: '14px', padding: '12px 14px' }"
      >
        <IconTile :icon="e.name.charAt(e.name.indexOf(' ') + 1)" :tone="toneByIndex(i)" :size="38" :radius="11" />
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-bold text-ink" style="font-size: 13.5px">{{ e.name }}</span>
            <span class="text-faint" style="font-size: 11px">{{ e.ago }}</span>
          </div>
          <div class="text-text-body truncate" style="font-size: 12px">{{ e.detail }}</div>
        </div>
        <div class="flex flex-col items-end gap-1.5 shrink-0">
          <span class="inline-flex items-center gap-1 font-bold" :style="{ padding: '3px 9px', borderRadius: '999px', fontSize: '10.5px', ...pillStyle(sourceTone(e.source)) }">
            <UIcon :name="sourceIcon(e.source)" aria-hidden="true" class="shrink-0" :style="{ width: '12px', height: '12px' }" />
            {{ e.source }}
          </span>
          <button class="font-bold text-whatsapp-deep cursor-pointer" style="font-size: 11.5px">
            <UIcon name="i-fluent-chat-16-regular" class="inline-block align-[-2px]" :style="{ width: '12px', height: '12px' }" />
            Follow-up
          </button>
        </div>
      </li>
      <li v-if="!rows.length" class="text-center text-faint py-4" style="font-size: 12.5px">
        No enquiries for this filter.
      </li>
    </ul>
  </section>
</template>
