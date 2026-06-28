<script setup lang="ts">
import { computed } from 'vue'
import { useLessonPlans } from '~/composables/useLessonPlans'
import { useClasses } from '~/composables/useClasses'
import { useSubjects } from '~/composables/useSubjects'
import IconTile from '~/components/ui/IconTile.vue'

const lessonPlans = useLessonPlans()
const classes = useClasses()
const subjects = useSubjects()

// Resolve each plan to its subject (via class) so the card can show icon + tone.
const cards = computed(() =>
  lessonPlans.all.map((p) => {
    const subjectName = classes.byId(p.classId)?.subject ?? ''
    const meta = subjects.byName(subjectName)
    return {
      ...p,
      subject: subjectName,
      icon: meta?.icon ?? '📘',
      tone: meta?.tone ?? 'violet',
    }
  }),
)
</script>

<template>
  <section>
    <h2 class="font-display font-bold text-ink" :style="{ fontSize: '18px', marginBottom: '14px' }">
      Rancangan pengajaran minggu ini
    </h2>

    <div
      :style="{
        display: 'grid',
        gap: '14px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      }"
    >
      <article
        v-for="card in cards"
        :key="card.id"
        class="bg-surface"
        :style="{
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: 'var(--shadow-card)',
        }"
      >
        <div class="flex items-center gap-2.5">
          <IconTile :icon="card.icon" :tone="card.tone" :size="40" :radius="12" />
          <span
            class="inline-flex items-center font-bold whitespace-nowrap"
            :style="{
              padding: '5px 11px',
              borderRadius: '999px',
              fontSize: '11.5px',
              background: 'var(--color-tile-' + card.tone + ')',
              color: 'var(--color-fg-' + card.tone + ')',
            }"
          >
            {{ card.cls }}
          </span>
        </div>

        <div class="font-bold text-muted uppercase" :style="{ fontSize: '10.5px', letterSpacing: '0.04em', marginTop: '14px' }">
          {{ card.week }}
        </div>
        <div class="font-display font-bold text-ink" :style="{ fontSize: '16px', marginTop: '3px', lineHeight: '1.25' }">
          {{ card.topic }}
        </div>
        <div class="text-muted" :style="{ fontSize: '12px', marginTop: '6px' }">
          Rujukan KPM: {{ card.ref }}
        </div>

        <!-- Attached material chip, or a dashed attach button. -->
        <span
          v-if="card.material"
          class="inline-flex items-center font-bold"
          :style="{
            marginTop: '14px',
            padding: '7px 12px',
            borderRadius: '10px',
            fontSize: '12px',
            gap: '5px',
            background: 'var(--color-surface-subtle)',
            color: 'var(--color-ink-soft)',
            border: '1px solid var(--color-border)',
          }"
        >
          📎 {{ card.material }}
        </span>
        <button
          v-else
          type="button"
          class="inline-flex items-center font-bold cursor-pointer"
          :style="{
            marginTop: '14px',
            padding: '7px 12px',
            borderRadius: '10px',
            fontSize: '12px',
            gap: '5px',
            background: 'transparent',
            color: 'var(--color-fg-violet)',
            border: '1.5px dashed var(--color-border-input)',
          }"
        >
          + Lampirkan bahan
        </button>
      </article>
    </div>
  </section>
</template>
