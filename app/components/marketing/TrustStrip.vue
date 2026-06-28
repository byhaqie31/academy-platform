<script setup lang="ts">
// pure presentation copy, kept in-component
const bullets = ['Guru bertauliah', 'Kelas kumpulan kecil', 'Nota & latihan tersusun', 'Laporan kemajuan']
</script>

<template>
  <section :style="{ background: 'var(--color-ink)' }">
    <div
      class="mx-auto flex flex-wrap items-center justify-center text-white"
      style="max-width: 1180px; padding: 18px 22px; gap: 14px 34px"
    >
      <span class="font-display font-semibold" style="font-size: 14px; opacity: 0.7">
        Ilmu hari ini, kecemerlangan esok ✨
      </span>
      <span :style="{ width: '5px', height: '5px', borderRadius: '50%', background: '#FF7AA8' }" />
      <span v-for="b in bullets" :key="b" style="font-size: 13.5px; font-weight: 600; opacity: 0.85">{{ b }}</span>
    </div>
  </section>
</template>
