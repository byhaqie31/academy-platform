<script setup lang="ts">
import { computed } from 'vue'
import { useStudents } from '~/composables/useStudents'
import { useGuardians } from '~/composables/useGuardians'
import { useClasses } from '~/composables/useClasses'
import { useBilling } from '~/composables/useBilling'
import { useSubjects } from '~/composables/useSubjects'
import { useAcademy } from '~/composables/useAcademy'
import LogoMark from '~/components/ui/LogoMark.vue'
import IconTile from '~/components/ui/IconTile.vue'
import StatusPill from '~/components/ui/StatusPill.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { toneTile } from '~/utils/tone'
import { formatRM } from '~/utils/money'

definePageMeta({ layout: false })

const students = useStudents()
const guardians = useGuardians()
const classes = useClasses()
const billing = useBilling()
const subjects = useSubjects()
const { academy, branchById, branchShort } = useAcademy()

// The sample family: Adam Haziq (s0) and his guardian, Puan Aisyah.
const student = computed(() => students.byId('s0')!)
const guardian = computed(() => guardians.forStudent('s0'))

// Strip the honorific so the avatar shows the given-name initial (Puan Aisyah -> A).
const guardianFirst = computed(() => {
  const n = guardian.value?.name ?? ''
  return n.replace(/^(Puan|Encik|Cik|Tuan)\s+/, '')
})
const guardianInitial = computed(() => guardianFirst.value.charAt(0) || '?')

// Adam's home branch, spelled out (e.g. "Kota Warisan, Sepang").
const branchName = computed(() => branchById(student.value.branchId)?.name ?? student.value.branchId)

// Subject chips for the SUBJEK info tile (Matematik · Sains · BI).
const subjectShort = computed(() =>
  student.value.subjects.map((name) => subjects.byName(name)?.short ?? name).join(' · '),
)

// Monthly fee, read from Adam's current invoice (RM 240), formatted the Malaysian way.
const fee = computed(() => {
  const inv = billing.all.find((i) => i.studentId === 's0')
  return formatRM(inv?.amount ?? 0)
})

// Adam's upcoming classes. He sits in c0's roster directly; the other two rows
// are picked per remaining subject, preferring a class at his own branch.
const schedule = computed(() => {
  const pool = classes.all
  return student.value.subjects.map((name) => {
    const cls =
      pool.find((c) => c.subject === name && c.roster.includes(student.value.name)) ??
      pool.find((c) => c.subject === name && c.branchId === student.value.branchId) ??
      pool.find((c) => c.subject === name)
    return {
      subject: name,
      icon: subjects.byName(name)?.icon ?? '📘',
      tone: subjects.byName(name)?.tone ?? 'violet',
      cls: cls?.cls ?? '',
      when: cls ? `${cls.day} · ${cls.time}` : '',
      branch: cls ? branchShort(cls.branchId) : '',
    }
  })
})

// WhatsApp the centre (digits only, country code prefixed by config).
const waLink = computed(() => `https://wa.me/${academy.contact.whatsapp}`)
</script>

<template>
  <div :style="{ background: 'var(--color-bg-app)', minHeight: '100vh' }">
    <!-- Own top bar (not the marketing header) -->
    <header
      class="sticky top-0 z-50"
      :style="{ background: '#fff', borderBottom: '1px solid var(--color-border-marketing)' }"
    >
      <div
        class="mx-auto flex items-center flex-wrap"
        :style="{ maxWidth: '880px', padding: '12px 22px', gap: '14px' }"
      >
        <NuxtLink to="/" class="flex items-center no-underline" :style="{ gap: '10px', flex: 'none' }">
          <LogoMark :size="38" />
          <div :style="{ lineHeight: '1.05' }">
            <div class="font-display font-bold text-ink" :style="{ fontSize: '16px' }">
              {{ academy.name }}
            </div>
            <div
              class="font-bold uppercase"
              :style="{ fontSize: '10px', color: 'var(--color-brand)', letterSpacing: '.04em' }"
            >
              Portal Ibu Bapa
            </div>
          </div>
        </NuxtLink>

        <div class="flex items-center" :style="{ gap: '12px', marginLeft: 'auto' }">
          <div class="flex items-center" :style="{ gap: '9px' }">
            <IconTile :icon="guardianInitial" tone="pink" :size="36" :radius="999" />
            <div :style="{ lineHeight: '1.1' }">
              <div class="font-bold text-ink" :style="{ fontSize: '13px' }">{{ guardian?.name }}</div>
              <div class="font-semibold text-muted" :style="{ fontSize: '11px' }">
                Ibu kepada {{ student.first }}
              </div>
            </div>
          </div>
          <NuxtLink
            to="/"
            class="inline-flex items-center no-underline font-bold"
            :style="{
              border: '1.5px solid var(--color-border-input)',
              background: '#fff',
              color: 'var(--color-ink-soft)',
              padding: '9px 15px',
              borderRadius: '999px',
              fontSize: '12.5px',
            }"
          >
            ← Keluar
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main :style="{ background: 'linear-gradient(180deg, #FBF8FF, #FFFFFF)' }">
      <div class="mx-auto" :style="{ maxWidth: '880px', padding: '46px 22px 70px' }">
        <div class="flex items-center" :style="{ gap: '8px', marginBottom: '10px' }">
          <StatusPill tone="violet" label="Pratonton · Portal Ibu Bapa" />
        </div>

        <h1
          class="font-display font-bold text-ink"
          :style="{ fontSize: 'clamp(1.7rem, 3.4vw, 2.3rem)', margin: '0 0 6px' }"
        >
          Selamat datang, {{ guardian?.name }} 👋
        </h1>
        <p class="font-semibold text-muted" :style="{ fontSize: '14px', margin: '0 0 26px' }">
          Lihat perkembangan {{ student.first }} dengan tenang, semuanya di satu tempat ✨
        </p>

        <div class="grid items-start" :style="{ gridTemplateColumns: '1.5fr 1fr', gap: '18px' }">
          <!-- Student card (full width) -->
          <section
            class="bg-surface"
            :style="{
              border: '1px solid var(--color-border-marketing)',
              borderRadius: '24px',
              padding: '26px',
              boxShadow: '0 10px 28px rgba(30,35,72,.06)',
              gridColumn: '1 / -1',
            }"
          >
            <div class="flex items-center flex-wrap" :style="{ gap: '16px' }">
              <IconTile :icon="student.first.charAt(0)" tone="violet" :size="66" :radius="20" />
              <div class="flex-1" :style="{ minWidth: '160px' }">
                <div class="font-display font-bold text-ink" :style="{ fontSize: '22px' }">
                  {{ student.name }}
                </div>
                <div class="font-semibold text-muted" :style="{ fontSize: '13.5px' }">
                  {{ student.level }} · {{ student.school }}
                </div>
              </div>
              <StatusPill tone="green" :label="'● ' + 'Pelajar ' + student.enrol" />
            </div>

            <div
              class="grid"
              :style="{
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px',
                marginTop: '22px',
              }"
            >
              <div
                :style="{ background: 'var(--color-surface-lavender)', borderRadius: '14px', padding: '15px' }"
              >
                <div
                  class="font-bold uppercase text-muted"
                  :style="{ fontSize: '11px', marginBottom: '4px' }"
                >
                  Cawangan
                </div>
                <div class="font-bold text-ink" :style="{ fontSize: '14px' }">{{ branchName }}</div>
              </div>
              <div
                :style="{ background: 'var(--color-surface-lavender)', borderRadius: '14px', padding: '15px' }"
              >
                <div
                  class="font-bold uppercase text-muted"
                  :style="{ fontSize: '11px', marginBottom: '4px' }"
                >
                  Subjek
                </div>
                <div class="font-bold text-ink" :style="{ fontSize: '14px' }">{{ subjectShort }}</div>
              </div>
              <div
                :style="{ background: 'var(--color-surface-lavender)', borderRadius: '14px', padding: '15px' }"
              >
                <div
                  class="font-bold uppercase text-muted"
                  :style="{ fontSize: '11px', marginBottom: '4px' }"
                >
                  Yuran Bulanan
                </div>
                <div class="font-bold text-ink" :style="{ fontSize: '14px' }">{{ fee }}</div>
              </div>
            </div>
          </section>

          <!-- Schedule card -->
          <section
            class="bg-surface"
            :style="{
              border: '1px solid var(--color-border-marketing)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 10px 28px rgba(30,35,72,.06)',
            }"
          >
            <div class="font-display font-semibold text-ink" :style="{ fontSize: '17px', marginBottom: '16px' }">
              📅 Jadual Kelas
            </div>
            <div
              v-for="c in schedule"
              :key="c.subject"
              class="flex items-center"
              :style="{
                gap: '12px',
                padding: '12px 0',
                borderBottom: '1px solid var(--color-divider)',
              }"
            >
              <div
                class="grid place-items-center shrink-0"
                :style="{ width: '42px', height: '42px', borderRadius: '12px', fontSize: '19px', background: toneTile(c.tone) }"
              >
                {{ c.icon }}
              </div>
              <div class="flex-1" :style="{ minWidth: '0' }">
                <div class="font-bold text-ink" :style="{ fontSize: '14px' }">{{ c.subject }}</div>
                <div class="font-semibold text-muted" :style="{ fontSize: '12px' }">
                  {{ c.when }} · {{ c.branch }}
                </div>
              </div>
            </div>
          </section>

          <!-- Payment reminder + announcement -->
          <div class="flex flex-col" :style="{ gap: '18px' }">
            <section
              :style="{
                background: 'linear-gradient(135deg, var(--color-tile-amber), #FFE9C7)',
                border: '1px solid #F5E3B8',
                borderRadius: '24px',
                padding: '24px',
              }"
            >
              <div
                class="font-display font-semibold"
                :style="{ fontSize: '16px', marginBottom: '8px', color: '#7A5A00' }"
              >
                💳 Peringatan Bayaran
              </div>
              <p :style="{ fontSize: '13.5px', color: '#8A6A1A', lineHeight: '1.5', margin: '0 0 14px' }">
                Yuran bulan Jun ialah {{ fee }}. Tarikh akhir bayaran:
                <strong>30 Jun 2026</strong>. Terima kasih kerana sentiasa menyokong {{ student.first }}.
              </p>
              <AppButton :to="waLink" variant="green" block>Bayar sekarang</AppButton>
            </section>

            <section
              class="bg-surface"
              :style="{
                border: '1px solid var(--color-border-marketing)',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: '0 10px 28px rgba(30,35,72,.06)',
              }"
            >
              <div class="font-display font-semibold text-ink" :style="{ fontSize: '16px', marginBottom: '8px' }">
                📣 Pengumuman
              </div>
              <p :style="{ fontSize: '13.5px', color: 'var(--color-ink-soft)', lineHeight: '1.5', margin: '0 0 14px' }">
                Cuti penggal bermula 5 Julai. Kelas ulang kaji peperiksaan akan dibuka minggu hadapan,
                tempat terhad. Hubungi kami untuk tempah tempat {{ student.first }}.
              </p>
              <AppButton :to="waLink" variant="outline" block>
                <span>💬</span> Hubungi kami
              </AppButton>
            </section>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
