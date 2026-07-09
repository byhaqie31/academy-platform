<script setup lang="ts">
import { useEducators } from '~/composables/useEducators'
import { formatRM } from '~/utils/money'

const { estimatedPay } = useEducators()
</script>

<template>
  <section
    class="relative overflow-hidden text-white"
    :style="{ background: 'var(--hero-dark-gradient)', borderRadius: '20px', padding: '22px', boxShadow: 'var(--shadow-revenue)' }"
  >
    <div
      class="absolute pointer-events-none"
      :style="{ top: '-50px', right: '-30px', width: '200px', height: '200px', borderRadius: '999px', background: 'radial-gradient(circle, rgba(255,122,168,.28), transparent 70%)' }"
    />
    <div class="relative">
      <span
        class="inline-flex items-center uppercase font-bold"
        :style="{ padding: '6px 12px', borderRadius: '999px', fontSize: '10.5px', letterSpacing: '0.06em', background: 'rgba(255,255,255,.1)', color: '#D8D5F2' }"
      >
        Estimated pay, June
      </span>
      <div class="font-display font-bold mt-3" style="font-size: 38px; line-height: 1">
        {{ formatRM(estimatedPay('hafiz')) }}
      </div>
      <NuxtLink
        to="/tutor/earnings"
        class="inline-flex items-center no-underline font-bold mt-4"
        style="font-size: 12.5px; color: #fff"
      >
        Hours breakdown →
      </NuxtLink>
    </div>
  </section>
</template>
