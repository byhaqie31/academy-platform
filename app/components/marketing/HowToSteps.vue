<script setup lang="ts">
import SectionHeading from '~/components/ui/SectionHeading.vue'

// pure presentation content from the prototype "Cara Daftar" section
const steps = [
  { num: 1, title: 'Daftar minat', desc: 'Isi borang ringkas dalam masa kurang 3 minit.', tile: '#8B6CF0' },
  { num: 2, title: 'Admin hubungi', desc: 'Pasukan kami WhatsApp anda untuk sahkan butiran.', tile: '#FF7AA8' },
  { num: 3, title: 'Pilih jadual', desc: 'Tetapkan cawangan, subjek & masa yang sesuai.', tile: '#3DA5F4' },
  { num: 4, title: 'Mula belajar', desc: 'Anak anda sertai kelas & terus cemerlang!', tile: '#34C77B' },
]
</script>

<template>
  <section :style="{ background: 'linear-gradient(180deg, #FFFFFF, #FBF8FF)', marginTop: '48px' }">
    <div class="mx-auto" style="max-width: 1180px; padding: 72px 22px">
      <SectionHeading
        center
        label="Cara daftar"
        title="Daftar minat anak anda dengan mudah"
        sub="Empat langkah ringkas, siap dalam masa kurang 3 minit."
        class="mb-11"
      />

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px">
        <div
          v-for="s in steps"
          :key="s.num"
          :style="{
            background: '#fff',
            border: '1px solid var(--color-border-marketing)',
            borderRadius: '22px',
            padding: '24px',
            boxShadow: 'var(--shadow-card)',
            position: 'relative',
          }"
        >
          <div
            class="grid place-items-center font-display font-bold text-white"
            :style="{ width: '46px', height: '46px', borderRadius: '14px', fontSize: '20px', background: s.tile, marginBottom: '16px' }"
          >
            {{ s.num }}
          </div>
          <h3 class="font-display font-semibold text-ink" style="font-size: 17px; margin: 0 0 7px">{{ s.title }}</h3>
          <p style="font-size: 13.5px; color: var(--color-ink-soft); line-height: 1.5; margin: 0">{{ s.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
