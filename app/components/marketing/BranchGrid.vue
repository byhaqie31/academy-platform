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
      <div
        v-for="(b, i) in branches"
        :key="b.id"
        class="flex flex-col"
        :style="{
          background: '#fff',
          border: '1px solid var(--color-border-marketing)',
          borderRadius: '22px',
          padding: '22px',
          boxShadow: 'var(--shadow-card)',
        }"
      >
        <IconTile icon="📍" :tone="toneByIndex(i)" :size="50" :radius="15" class="mb-3.5" />
        <h3 class="font-display font-semibold text-ink" style="font-size: 18px; margin: 0 0 6px">{{ b.name }}</h3>
        <p style="font-size: 13px; color: var(--color-ink-soft); margin: 0 0 18px; font-weight: 600">{{ b.hours }}</p>
        <div class="flex" style="gap: 9px; margin-top: auto">
          <AppButton to="/daftar" variant="dark" block>Lihat kelas</AppButton>
          <AppButton to="/daftar" variant="outline" block>Dapatkan arah</AppButton>
        </div>
      </div>
    </div>
  </section>
</template>
