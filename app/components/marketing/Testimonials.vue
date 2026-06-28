<script setup lang="ts">
import SectionHeading from '~/components/ui/SectionHeading.vue'
import { tonePair } from '~/utils/tone'
import type { SubjectTone } from '~/types'

// pure presentation content from the prototype "Kata ibu bapa" section
const testimonials: { quote: string; name: string; role: string; initial: string; tone: SubjectTone }[] = [
  {
    quote: 'Anak saya jadi lebih yakin dengan Matematik. Guru sangat sabar dan suasana belajar seronok.',
    name: 'Puan Noraini',
    role: 'Ibu kepada pelajar Tahun 5',
    initial: 'N',
    tone: 'pink',
  },
  {
    quote: 'Senang nak daftar dan admin cepat balas WhatsApp. Markah PT3 anak saya naik banyak.',
    name: 'Encik Faizal',
    role: 'Bapa kepada pelajar Tingkatan 3',
    initial: 'F',
    tone: 'blue',
  },
  {
    quote: 'Cawangan dekat rumah, jadual fleksibel. Anak saya tak rasa stress langsung.',
    name: 'Puan Sufiah',
    role: 'Ibu kepada pelajar SPM',
    initial: 'S',
    tone: 'violet',
  },
]
</script>

<template>
  <section class="mx-auto" style="max-width: 1180px; padding: 72px 22px">
    <SectionHeading
      center
      label="Kata ibu bapa"
      title="Mereka belajar dengan yakin"
      class="mb-10"
    />

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px">
      <div
        v-for="t in testimonials"
        :key="t.name"
        :style="{
          background: '#fff',
          border: '1px solid var(--color-border-marketing)',
          borderRadius: '22px',
          padding: '24px',
          boxShadow: 'var(--shadow-card)',
        }"
      >
        <div :style="{ color: 'var(--color-star)', fontSize: '15px', marginBottom: '12px', letterSpacing: '2px' }">★★★★★</div>
        <p style="font-size: 14.5px; color: #3a3f5c; line-height: 1.6; margin: 0 0 18px">“{{ t.quote }}”</p>
        <div class="flex items-center" style="gap: 11px">
          <div
            class="grid place-items-center font-display font-bold"
            :style="{ width: '42px', height: '42px', borderRadius: '50%', ...tonePair(t.tone) }"
          >
            {{ t.initial }}
          </div>
          <div>
            <div class="font-bold text-ink" style="font-size: 13.5px">{{ t.name }}</div>
            <div style="font-size: 12px; color: var(--color-muted); font-weight: 600">{{ t.role }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
