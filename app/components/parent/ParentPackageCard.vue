<script setup lang="ts">
import { formatRM } from '~/utils/money'
import { toneTile, toneFg } from '~/utils/tone'
import type { FeeLine } from '~/composables/useParentPortal'

defineProps<{ lines: FeeLine[]; available: FeeLine[]; total: number; childFirst: string }>()
</script>

<template>
  <section
    class="bg-surface"
    :style="{
      border: '1px solid var(--color-border-marketing)',
      borderRadius: '24px',
      padding: '18px',
      boxShadow: '0 10px 28px rgba(30,35,72,.06)',
    }"
  >
    <div class="font-display font-semibold text-ink" :style="{ fontSize: '16px', marginBottom: '4px' }">
      <UIcon name="i-fluent-box-16-regular" class="inline-block align-[-2px]" :style="{ width: '14px', height: '14px' }" />
      Pakej {{ childFirst }}
    </div>
    <p class="text-muted" :style="{ fontSize: '12.5px', margin: '0 0 14px' }">
      Yuran dikira ikut subjek yang diambil
    </p>

    <div class="flex flex-col">
      <div
        v-for="(l, i) in lines"
        :key="l.subject"
        class="flex items-center gap-3"
        :style="{
          padding: '11px 0',
          borderTop: i === 0 ? 'none' : '1px solid var(--color-divider)',
        }"
      >
        <div
          class="grid place-items-center shrink-0 font-bold"
          :style="{
            width: '34px', height: '34px', borderRadius: '10px',
            background: toneTile(l.tone), color: toneFg(l.tone), fontSize: '12px',
          }"
        >
          {{ l.subject.slice(0, 2) }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-ink truncate" :style="{ fontSize: '14px' }">{{ l.subject }}</div>
        </div>
        <div class="font-semibold text-ink-soft shrink-0" :style="{ fontSize: '13.5px' }">
          {{ formatRM(l.amount) }}
        </div>
        <StatusPill
          :tone="l.paid ? 'green' : 'overdue'"
          :label="l.paid ? 'Aktif' : 'Belum bayar'"
        />
      </div>

      <div
        v-for="l in available"
        :key="l.subject"
        class="flex items-center gap-3"
        :style="{ padding: '11px 0', borderTop: '1px dashed var(--color-dashed)' }"
      >
        <div
          class="grid place-items-center shrink-0 font-bold"
          :style="{
            width: '34px', height: '34px', borderRadius: '10px',
            background: 'var(--color-surface-lavender)', color: 'var(--color-faint)', fontSize: '12px',
          }"
        >
          {{ l.subject.slice(0, 2) }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-muted truncate" :style="{ fontSize: '14px' }">{{ l.subject }}</div>
          <div class="text-faint" :style="{ fontSize: '11.5px' }">Belum berdaftar</div>
        </div>
        <div class="font-semibold text-faint shrink-0" :style="{ fontSize: '13.5px' }">
          {{ formatRM(l.amount) }}
        </div>
        <button
          type="button"
          class="font-bold shrink-0 transition-colors"
          :style="{
            padding: '5px 13px', borderRadius: '999px', fontSize: '12px',
            background: 'var(--color-tile-violet)', color: 'var(--color-fg-violet)',
          }"
        >
          + Tambah
        </button>
      </div>
    </div>

    <div
      class="flex items-center justify-between"
      :style="{ borderTop: '1px solid var(--color-border)', marginTop: '4px', paddingTop: '13px' }"
    >
      <span class="font-semibold text-ink-soft" :style="{ fontSize: '13.5px' }">Jumlah bulan ini</span>
      <span class="font-display font-bold text-ink" :style="{ fontSize: '18px' }">{{ formatRM(total) }}</span>
    </div>
  </section>
</template>
