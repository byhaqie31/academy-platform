<script setup lang="ts">
import SectionHeading from '~/components/ui/SectionHeading.vue'
import AppButton from '~/components/ui/AppButton.vue'
import FeeTable from '~/components/marketing/FeeTable.vue'
import CheckList from '~/components/marketing/CheckList.vue'
import { useSiteContent } from '~/composables/useSiteContent'
import { useFees } from '~/composables/useFees'

definePageMeta({ layout: 'marketing' })

const { fees: feesCopy } = useSiteContent()
const { includes, discounts, discountLede, paymentNote } = useFees()

useShareCard({
  path: '/fees',
  title: 'Yuran · {academy}',
  description: feesCopy.section.lede,
})
</script>

<template>
  <section class="mx-auto" style="max-width: 1120px; padding: 60px 22px 76px">
    <SectionHeading
      :label="feesCopy.section.eyebrow"
      :title="feesCopy.section.title"
      :sub="feesCopy.section.lede"
      class="mb-11"
    />

    <FeeTable />

    <div class="grid gap-11 lg:grid-cols-2 items-start" style="margin-top: 44px">
      <div
        :style="{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
          padding: '30px',
          boxShadow: 'var(--shadow-card)',
        }"
      >
        <h2 class="font-display font-semibold text-ink" style="font-size: 19px; margin-bottom: 16px">
          Termasuk dalam yuran
        </h2>
        <CheckList :items="includes" />
      </div>

      <div>
        <h2 class="font-display font-semibold text-ink" style="font-size: 19px; margin-bottom: 14px">
          Diskaun
        </h2>
        <p class="text-muted" style="font-size: 15.5px; line-height: 1.65; margin-bottom: 18px">
          {{ discountLede }}
        </p>
        <div
          :style="{
            background: 'var(--color-surface-lavender)',
            border: '1px solid var(--color-border-input)',
            borderRadius: '18px',
            padding: '22px 24px',
          }"
        >
          <p
            v-for="d in discounts"
            :key="d.label"
            class="text-text-body"
            style="font-size: 15.5px; line-height: 1.9"
          >
            <b class="text-ink">{{ d.label }}</b> · {{ d.note }}
          </p>
        </div>

        <h2 class="font-display font-semibold text-ink" style="font-size: 19px; margin: 28px 0 14px">
          Cara pembayaran
        </h2>
        <p class="text-muted" style="font-size: 15.5px; line-height: 1.65">{{ paymentNote }}</p>
      </div>
    </div>

    <div class="text-center" style="margin-top: 44px">
      <AppButton to="/register" variant="gradient" size="lg" pill>
        Cuba satu kelas percuma dahulu
      </AppButton>
    </div>
  </section>
</template>
