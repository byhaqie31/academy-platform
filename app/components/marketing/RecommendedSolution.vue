<script setup lang="ts">
import { tonePair } from '~/utils/tone'
import type { SubjectTone } from '~/types'

// pure presentation content from the prototype "Recommended solution" section
const features: { icon: string; title: string; desc: string; tone: SubjectTone }[] = [
  { icon: '🌐', title: 'Laman web profesional', desc: 'Imej akademi yang moden & dipercayai.', tone: 'blue' },
  { icon: '📝', title: 'Pendaftaran online', desc: 'Borang pelajar mesra mobile, tanpa kerumitan.', tone: 'pink' },
  { icon: '💬', title: 'WhatsApp enquiry flow', desc: 'Sambung terus ke WhatsApp selepas daftar.', tone: 'green' },
  { icon: '📚', title: 'Senarai cawangan & subjek', desc: 'Maklumat lengkap untuk ibu bapa.', tone: 'amber' },
  { icon: '📊', title: 'Dashboard admin', desc: 'Urus enquiry & pelajar dengan tersusun.', tone: 'violet' },
  { icon: '💳', title: 'Tracking pelajar & bayaran', desc: 'Kurangkan kerja manual melalui WhatsApp.', tone: 'blue' },
]
const future = ['Parent portal', 'Attendance tracking', 'Payment reminder automation', 'Teacher dashboard', 'Exam progress report']
</script>

<template>
  <section class="relative overflow-hidden text-white" :style="{ background: 'var(--color-ink)' }">
    <div :style="{ position: 'absolute', top: '-80px', right: '-40px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,108,240,.4), transparent 70%)' }" />
    <div :style="{ position: 'absolute', bottom: '-100px', left: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,122,168,.3), transparent 70%)' }" />

    <div class="relative mx-auto" style="max-width: 1180px; padding: 74px 22px">
      <div class="text-center mx-auto" style="max-width: 660px; margin-bottom: 44px">
        <span
          class="inline-block font-bold"
          :style="{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: '12.5px', marginBottom: '16px' }"
        >
          Recommended solution
        </span>
        <h2 class="font-display font-bold" style="font-size: clamp(1.9rem, 3.6vw, 2.8rem); margin: 0 0 12px; line-height: 1.1">
          Student registration website + admin dashboard
        </h2>
        <p style="font-size: 16px; color: #b9bdd6; line-height: 1.6; margin: 0">
          Bukan sekadar laman web, satu sistem pendaftaran & pengurusan akademi yang lengkap.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 46px">
        <div
          v-for="f in features"
          :key="f.title"
          :style="{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '20px', padding: '22px' }"
        >
          <div
            class="grid place-items-center"
            :style="{ width: '46px', height: '46px', borderRadius: '14px', fontSize: '22px', marginBottom: '14px', ...tonePair(f.tone) }"
          >
            {{ f.icon }}
          </div>
          <h3 class="font-display font-semibold" style="font-size: 16.5px; margin: 0 0 6px; color: #fff">{{ f.title }}</h3>
          <p style="font-size: 13px; color: #b9bdd6; line-height: 1.5; margin: 0">{{ f.desc }}</p>
        </div>
      </div>

      <div :style="{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '22px', padding: '26px' }">
        <div class="font-display font-semibold" style="font-size: 15px; margin-bottom: 16px; color: #FFD3E2">🚀 Future expansion</div>
        <div class="flex flex-wrap" style="gap: 10px">
          <span
            v-for="x in future"
            :key="x"
            :style="{ padding: '9px 15px', borderRadius: '999px', background: 'rgba(255,255,255,.1)', fontSize: '13px', fontWeight: '600', color: '#E8E9F5' }"
          >
            {{ x }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
