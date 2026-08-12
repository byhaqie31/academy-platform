<script setup lang="ts">
import { computed } from 'vue'
import { useParentPortal } from '~/composables/useParentPortal'

definePageMeta({ layout: 'parent' })

const p = useParentPortal()

/** the payment card leads from the 1st to the 7th, and drops back after */
const moneyFirst = computed(() => p.cycle.value !== 'paid')

const dots = computed(() =>
  Array.from({ length: p.attendance.value.total }, (_, i) => i < p.attendance.value.attended),
)
</script>

<template>
  <!--
    Mobile: one flex column, narrative order driven by `order-*`.
    Desktop (lg+): a 1.5fr/1fr grid. The column wrappers are `contents` on
    mobile so their children join the outer flex and keep the same order.
  -->
  <div class="flex flex-col gap-4 lg:grid lg:grid-cols-[1.5fr_1fr] lg:gap-[18px] lg:items-start">
    <header class="lg:col-span-2">
      <h1
        class="font-display font-bold text-ink"
        :style="{ fontSize: 'clamp(1.5rem, 5vw, 1.9rem)', lineHeight: '1.15', margin: '0 0 4px' }"
      >
        Salam, {{ p.guardianFirst.value }} 👋
      </h1>
      <p class="font-semibold text-muted" :style="{ fontSize: '13.5px', margin: 0 }">
        Ini yang berlaku dengan {{ p.child.first }} hari ini
      </p>
    </header>

    <!-- Left column at lg: today's classes, then the week. -->
    <div class="contents lg:flex lg:flex-col lg:gap-[18px]">
      <section
        class="order-2 bg-surface"
        :style="{
          border: '1px solid var(--color-border-marketing)',
          borderRadius: '24px',
          padding: '18px',
          boxShadow: '0 10px 28px rgba(30,35,72,.06)',
        }"
      >
        <div class="flex items-center justify-between gap-3" :style="{ marginBottom: '14px' }">
          <div class="font-display font-semibold text-ink" :style="{ fontSize: '16px' }">
            🎒 Kelas hari ini
          </div>
          <span class="font-semibold text-faint" :style="{ fontSize: '12px' }">{{ p.todayLabel }}</span>
        </div>

        <div v-if="p.todayRows.value.length" class="flex flex-col" :style="{ gap: '10px' }">
          <ParentClassRow
            v-for="row in p.todayRows.value"
            :key="row.cls.id"
            :row="row"
            show-join
          />
        </div>

        <p v-else class="text-muted" :style="{ fontSize: '13px', margin: 0 }">
          Tiada kelas hari ini. Kelas seterusnya hari Isnin.
        </p>
      </section>

      <section
        class="order-5 bg-surface"
        :style="{
          border: '1px solid var(--color-border-marketing)',
          borderRadius: '24px',
          padding: '18px',
          boxShadow: '0 10px 28px rgba(30,35,72,.06)',
        }"
      >
        <div class="font-display font-semibold text-ink" :style="{ fontSize: '16px', marginBottom: '12px' }">
          📅 Jadual minggu ini
        </div>
        <div class="flex flex-col" :style="{ gap: '12px' }">
          <ParentClassRow v-for="row in p.rows.value" :key="row.cls.id" :row="row" />
        </div>
      </section>
    </div>

    <!-- Right column at lg: payment, attendance, package. -->
    <div class="contents lg:flex lg:flex-col lg:gap-[18px]">
      <ParentPaymentCard
        :class="moneyFirst ? 'order-1' : 'order-6'"
        :cycle="p.cycle.value"
        :period="p.period"
        :due-label="p.dueLabel"
        :paid-on="p.paidLabel"
        :total="p.invoiceTotal.value"
        :outstanding="p.outstanding.value"
        :days-left="p.daysLeft.value"
      />

      <section
        class="order-3 bg-surface"
        :style="{
          border: '1px solid var(--color-border-marketing)',
          borderRadius: '24px',
          padding: '18px',
          boxShadow: '0 10px 28px rgba(30,35,72,.06)',
        }"
      >
        <div class="flex items-center justify-between gap-3" :style="{ marginBottom: '12px' }">
          <div class="font-display font-semibold text-ink" :style="{ fontSize: '16px' }">
            ✅ Kehadiran
          </div>
          <span class="font-semibold text-ink-soft" :style="{ fontSize: '13px' }">
            Hadir {{ p.attendance.value.attended }} daripada {{ p.attendance.value.total }} kelas
          </span>
        </div>
        <div class="flex items-center" :style="{ gap: '6px' }">
          <span
            v-for="(hadir, i) in dots"
            :key="i"
            :style="{
              width: '100%',
              height: '9px',
              borderRadius: '999px',
              background: hadir ? 'var(--color-fg-green)' : 'var(--color-tile-inactive)',
            }"
          />
        </div>
        <p class="text-muted" :style="{ fontSize: '12.5px', margin: '11px 0 0' }">
          {{ p.attendance.value.note }}
        </p>
      </section>

      <ParentPackageCard
        class="order-4"
        :lines="p.lines.value"
        :available="p.available.value"
        :total="p.invoiceTotal.value"
        :child-first="p.child.first"
      />
    </div>

    <p class="order-7 lg:col-span-2 text-center text-faint" :style="{ fontSize: '12px', margin: '4px 0 0' }">
      Ada soalan? <span class="font-semibold" :style="{ color: 'var(--color-whatsapp-deep)' }">Hubungi kami di WhatsApp</span>
    </p>
  </div>
</template>
