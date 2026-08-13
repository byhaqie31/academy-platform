<script setup lang="ts">
// Demo control, not part of the product. A dark rail fixed to the left
// viewport edge, deliberately outside the product frame so a stakeholder
// can see where the sample-demo scaffolding ends and the product begins.
// The layout shows it only at lg+ and clears its width with padding.
</script>

<template>
  <aside
    class="fixed left-0 top-0 bottom-0 flex flex-col"
    :style="{
      width: '240px',
      zIndex: 55,
      background: 'var(--color-ink)',
      padding: '20px 16px',
      overflowY: 'auto',
    }"
  >
    <div :style="{ marginBottom: '16px' }">
      <div
        class="inline-flex items-center font-bold uppercase"
        :style="{
          gap: '6px',
          background: 'rgba(255,255,255,.12)',
          color: '#fff',
          borderRadius: '999px',
          padding: '5px 11px',
          fontSize: '10px',
          letterSpacing: '0.08em',
        }"
      >
        <UIcon name="i-fluent-sparkle-16-regular" class="inline-block align-[-2px]" :style="{ width: '12px', height: '12px' }" />
        Demo
      </div>
      <div
        class="font-semibold"
        :style="{ color: 'rgba(255,255,255,.55)', fontSize: '11.5px', marginTop: '10px' }"
      >
        Kitaran bulanan, tekan untuk tukar keadaan
      </div>
    </div>

    <ParentDemoStepList variant="dark" />

    <NuxtLink
      to="/demo"
      class="font-semibold no-underline transition-colors"
      :style="{
        marginTop: 'auto',
        paddingTop: '18px',
        color: 'rgba(255,255,255,.65)',
        fontSize: '12.5px',
      }"
    >
      ← Keluar demo
    </NuxtLink>
  </aside>
</template>
