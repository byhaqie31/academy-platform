<script setup lang="ts">
import { computed } from 'vue'
import { useGuardians } from '~/composables/useGuardians'
import IconTile from '~/components/ui/IconTile.vue'
import AppButton from '~/components/ui/AppButton.vue'

const props = defineProps<{ studentId: string; firstName: string }>()

const guardian = computed(() => useGuardians().forStudent(props.studentId))

// Strip the honorific so the avatar shows the actual given-name initial.
const initial = computed(() => {
  const n = guardian.value?.name ?? ''
  return n.replace('Puan ', '').replace('Encik ', '').charAt(0) || '?'
})

// wa.me wants digits only. Prefix the Malaysian country code, drop the leading 0.
const waLink = computed(() => {
  const digits = (guardian.value?.phone ?? '').replace(/\D/g, '').replace(/^0/, '')
  return `https://wa.me/6${digits}`
})
</script>

<template>
  <section
    v-if="guardian"
    class="bg-surface"
    :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '22px' }"
  >
    <h2 class="font-display font-semibold text-ink" style="font-size: 17px">Guardian</h2>

    <div class="flex items-center gap-3 mt-4 mb-4">
      <IconTile :icon="initial" tone="pink" :size="46" :radius="14" />
      <div class="min-w-0">
        <div class="font-bold text-ink" style="font-size: 14.5px">{{ guardian.name }}</div>
        <div class="text-faint" style="font-size: 12px; font-weight: 600">
          Parent/guardian of {{ firstName }}
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2.5">
      <div
        class="flex items-center gap-2.5"
        :style="{
          padding: '11px 13px',
          borderRadius: '13px',
          background: 'var(--color-surface-subtle)',
          border: '1px solid var(--color-divider)',
        }"
      >
        <UIcon name="i-fluent-call-16-regular" class="shrink-0" :style="{ width: '15px', height: '15px' }" />
        <div>
          <div class="font-bold text-faint uppercase" style="font-size: 10.5px">Phone</div>
          <div class="font-bold text-ink" style="font-size: 13px">{{ guardian.phone }}</div>
        </div>
      </div>
      <AppButton variant="whatsapp" :to="waLink" block>
        <UIcon name="i-fluent-chat-16-regular" class="inline-block align-[-2px]" :style="{ width: '14px', height: '14px' }" />
        WhatsApp guardian
      </AppButton>
    </div>
  </section>
</template>
