<script setup lang="ts">
import SectionHeading from '~/components/ui/SectionHeading.vue'
import IconTile from '~/components/ui/IconTile.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { useAcademy } from '~/composables/useAcademy'
import { toneByIndex } from '~/utils/tone'

const { branches } = useAcademy()
</script>

<template>
  <section class="mx-auto" style="max-width: 1180px; padding: 64px 22px 20px">
    <SectionHeading
      center
      label="Cawangan"
      title="Pilih cawangan terdekat"
      sub="Empat lokasi mesra keluarga, sentiasa berkembang untuk anak anda."
      class="mb-10"
    />

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(255px, 1fr)); gap: 18px">
      <div v-for="(b, i) in branches" :key="b.id" class="branch-card flex flex-col">
        <IconTile icon="📍" :tone="toneByIndex(i)" :size="50" :radius="15" class="mb-4" />
        <h3
          class="font-display font-semibold text-ink"
          style="font-size: 18px; margin: 0 0 14px; line-height: 1.25"
        >
          {{ b.name }}
        </h3>

        <!-- Operating hours, presented as a labelled info field. -->
        <div
          class="flex items-center"
          :style="{
            gap: '11px',
            padding: '11px 13px',
            borderRadius: '14px',
            marginBottom: '18px',
            background: 'var(--color-surface-lavender)',
            border: '1px solid var(--color-border-marketing)',
          }"
        >
          <span
            class="grid place-items-center shrink-0"
            :style="{
              width: '34px',
              height: '34px',
              borderRadius: '999px',
              background: '#fff',
              border: '1px solid var(--color-border-marketing)',
              fontSize: '16px',
            }"
          >🕐</span>
          <div style="min-width: 0">
            <div
              class="font-bold uppercase"
              style="font-size: 10px; letter-spacing: 0.05em; color: var(--color-muted); margin-bottom: 1px"
            >
              Waktu operasi
            </div>
            <div class="font-bold text-ink" style="font-size: 12.5px; line-height: 1.25">{{ b.hours }}</div>
          </div>
        </div>

        <!-- Stacked call to action: primary above, directions below. -->
        <div class="flex flex-col" style="gap: 9px; margin-top: auto">
          <AppButton to="/register" variant="dark" block>Lihat kelas</AppButton>
          <AppButton to="/register" variant="outline" block>Dapatkan arah</AppButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.branch-card {
  background: #fff;
  border: 1px solid var(--color-border-marketing);
  border-radius: 22px;
  padding: 22px;
  box-shadow: var(--shadow-card);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.branch-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
}
</style>
