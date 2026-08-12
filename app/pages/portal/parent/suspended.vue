<script setup lang="ts">
import { computed } from 'vue'
import { useParentPortal } from '~/composables/useParentPortal'
import { useAcademy } from '~/composables/useAcademy'
import { formatRM } from '~/utils/money'
import { toneTile, toneFg } from '~/utils/tone'

definePageMeta({ layout: 'parent' })

/**
 * The recovery screen.
 *
 * Not a locked door. One screen, one job: get a parent from suspended to
 * sitting in tonight's class in two taps. Nothing else belongs here, which is
 * why there is no navigation, no upsell and no policy explanation on it.
 */
const p = useParentPortal()
const { academy } = useAcademy()
const wa = `https://wa.me/${academy.contact.whatsapp}`
const unpaid = computed(() => p.lines.value.filter((l) => !l.paid))
/** the promise has to name a real class, not a hardcoded time */
const nextToday = computed(() => p.todayRows.value[0])
const owed = computed(() => unpaid.value.reduce((n, l) => n + l.amount, 0) || p.invoiceTotal.value)
</script>

<template>
  <div class="mx-auto w-full flex flex-col" :style="{ gap: '16px', maxWidth: '540px' }">
    <section
      class="bg-surface"
      :style="{
        border: '1px solid var(--color-border-marketing)',
        borderRadius: '24px',
        padding: '22px 18px',
        boxShadow: '0 10px 28px rgba(30,35,72,.06)',
      }"
    >
      <IconTile icon="🔒" tone="overdue" :size="52" :radius="16" />

      <h1
        class="font-display font-bold text-ink"
        :style="{ fontSize: 'clamp(1.4rem, 4.6vw, 1.75rem)', lineHeight: '1.2', margin: '15px 0 6px' }"
      >
        Kelas {{ p.child.first }} disekat
      </h1>
      <p class="text-muted" :style="{ fontSize: '14px', margin: '0 0 18px' }">
        Yuran {{ p.period }} belum dijelaskan.
      </p>

      <div
        :style="{
          background: 'var(--color-surface-lavender)',
          borderRadius: '18px',
          padding: '15px 16px',
          marginBottom: '16px',
        }"
      >
        <div
          v-for="(l, i) in unpaid"
          :key="l.subject"
          class="flex items-center gap-3"
          :style="{ padding: '8px 0', borderTop: i === 0 ? 'none' : '1px solid var(--color-border-input)' }"
        >
          <div
            class="grid place-items-center shrink-0 font-bold"
            :style="{
              width: '30px', height: '30px', borderRadius: '9px',
              background: toneTile(l.tone), color: toneFg(l.tone), fontSize: '11px',
            }"
          >
            {{ l.subject.slice(0, 2) }}
          </div>
          <span class="flex-1 font-semibold text-ink" :style="{ fontSize: '13.5px' }">{{ l.subject }}</span>
          <span class="font-semibold text-ink-soft" :style="{ fontSize: '13.5px' }">{{ formatRM(l.amount) }}</span>
        </div>

        <div
          class="flex items-center justify-between"
          :style="{ borderTop: '1px solid var(--color-border-input)', marginTop: '6px', paddingTop: '11px' }"
        >
          <span class="font-bold uppercase text-muted" :style="{ fontSize: '10.5px', letterSpacing: '0.05em' }">
            Jumlah
          </span>
          <span class="font-display font-bold text-ink" :style="{ fontSize: '27px', lineHeight: '1.1' }">
            {{ formatRM(owed) }}
          </span>
        </div>
      </div>

      <AppButton to="/portal/parent" variant="green" block size="lg">
        Bayar sekarang
      </AppButton>

      <div
        class="flex items-start gap-2.5"
        :style="{
          background: 'var(--color-tile-green)',
          borderRadius: '14px',
          padding: '12px 14px',
          marginTop: '12px',
        }"
      >
        <span :style="{ fontSize: '15px', lineHeight: '1.3' }">⚡</span>
        <p class="font-semibold" :style="{ color: 'var(--color-fg-green)', fontSize: '13px', margin: 0, lineHeight: '1.45' }">
          Akses kembali serta-merta.
          <template v-if="nextToday">
            {{ p.child.first }} boleh masuk kelas {{ nextToday.subject }}
            jam {{ nextToday.cls.time }} hari ini.
          </template>
          <template v-else>
            {{ p.child.first }} boleh masuk kelas seterusnya seperti biasa.
          </template>
        </p>
      </div>
    </section>

    <a
      :href="wa"
      target="_blank"
      rel="noopener"
      class="flex items-center justify-center gap-2 font-semibold transition-colors"
      :style="{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-marketing)',
        borderRadius: '14px',
        padding: '13px',
        fontSize: '13.5px',
        color: 'var(--color-ink-soft)',
      }"
    >
      💬 Hubungi kami
    </a>

    <p class="text-center text-faint" :style="{ fontSize: '11.5px', margin: 0, lineHeight: '1.5' }">
      Sudah bayar tapi masih disekat? Hantar resit di WhatsApp,<br>
      kami buka semula dalam masa 5 minit.
    </p>
  </div>
</template>
