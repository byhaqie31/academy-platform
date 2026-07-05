<script setup lang="ts">
import SectionHeading from '~/components/ui/SectionHeading.vue'
import IconTile from '~/components/ui/IconTile.vue'
import { tonePair } from '~/utils/tone'
import type { SubjectTone } from '~/types'

// pure presentation content: why parents choose the academy
const benefits: { icon: string; title: string; desc: string; proof: string; tone: SubjectTone }[] = [
  {
    icon: '🎓',
    title: 'Guru bertauliah & berpengalaman',
    desc: 'Diajar guru terlatih yang faham silibus KPM dan tahu cara buat anak betul-betul faham.',
    proof: '50+ guru berpengalaman',
    tone: 'violet',
  },
  {
    icon: '👥',
    title: 'Kelas kumpulan kecil',
    desc: 'Kumpulan kecil, jadi setiap anak dapat perhatian, bukan sekadar nombor dalam kelas.',
    proof: 'Purata 8 pelajar sekelas',
    tone: 'pink',
  },
  {
    icon: '📈',
    title: 'Keputusan terbukti',
    desc: 'Latihan tersusun dan pemantauan rapi. Markah naik dan keyakinan pun bertambah.',
    proof: 'Markah naik 28% sebulan',
    tone: 'blue',
  },
]
</script>

<template>
  <section :style="{ background: 'linear-gradient(180deg, #FBF8FF 0%, #FFFFFF 100%)' }">
    <div class="mx-auto" style="max-width: 1180px; padding: 72px 22px">
      <SectionHeading
        center
        label="Kenapa Hz Academy"
        title="Sebab ibu bapa percayakan kami"
        sub="Bukan sekadar kelas tambahan, satu tempat belajar yang buat anak faham, yakin, dan seronok."
        class="mb-11"
      />

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px">
        <div
          v-for="b in benefits"
          :key="b.title"
          :style="{
            background: '#fff',
            border: '1px solid var(--color-border-marketing)',
            borderRadius: '22px',
            padding: '26px',
            boxShadow: 'var(--shadow-card)',
          }"
        >
          <IconTile :icon="b.icon" :tone="b.tone" :size="52" :radius="16" />
          <h3 class="font-display font-semibold text-ink" style="font-size: 18px; margin: 16px 0 7px">
            {{ b.title }}
          </h3>
          <p style="font-size: 13.5px; color: var(--color-ink-soft); line-height: 1.55; margin: 0 0 18px">
            {{ b.desc }}
          </p>
          <span
            class="inline-flex items-center font-bold"
            :style="{ gap: '6px', padding: '7px 13px', borderRadius: '999px', fontSize: '12px', ...tonePair(b.tone) }"
          >
            ✓ {{ b.proof }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
