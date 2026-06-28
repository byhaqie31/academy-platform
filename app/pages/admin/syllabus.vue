<script setup lang="ts">
import { computed, ref } from 'vue'
import IconTile from '~/components/ui/IconTile.vue'
import AppButton from '~/components/ui/AppButton.vue'
import SyllabusBank from '~/components/admin/SyllabusBank.vue'
import { useSubjects } from '~/composables/useSubjects'
import type { Stage } from '~/types'

definePageMeta({ layout: 'admin' })

const subjects = useSubjects()

// Stage metadata: label + level range, plus the per-stage class levels.
const stageDefs: { key: Stage; label: string; range: string; levels: string[] }[] = [
  { key: 'rendah', label: 'Sekolah Rendah', range: 'Tahun 1 to 6', levels: ['Tahun 3', 'Tahun 4', 'Tahun 5', 'Tahun 6'] },
  { key: 'mr', label: 'Menengah Rendah', range: 'Tingkatan 1 to 3', levels: ['Tingkatan 1', 'Tingkatan 2', 'Tingkatan 3'] },
  { key: 'ma', label: 'Menengah Atas', range: 'Tingkatan 4 to 5', levels: ['Tingkatan 4', 'Tingkatan 5'] },
]

const stage = ref<Stage>('rendah')
const selected = ref(0)

function pickStage(s: Stage) {
  stage.value = s
  selected.value = 0
}

const bank = computed(() => subjects.bankFor(stage.value))
const stageDef = computed(() => stageDefs.find((s) => s.key === stage.value)!)
const selRow = computed(() => bank.value[selected.value] ?? bank.value[0])
const selName = computed(() => selRow.value?.[0] ?? '')
const selMeta = computed(() => subjects.byName(selName.value))

const classList = computed(() =>
  stageDef.value.levels.map((lv, k) => ({
    name: `${selName.value} · ${lv}`,
    note: `${3 + (k % 3)} kelas · ${2 + (k % 2)} bahan dilampirkan`,
  })),
)
</script>

<template>
  <div class="flex flex-col gap-5">
    <header>
      <h1 class="font-display font-bold text-ink" style="font-size: 28px; line-height: 1.1">
        Syllabus
        <span class="text-faint font-semibold" style="font-size: 18px">/ Silibus</span>
      </h1>
      <p class="text-muted font-semibold mt-1" style="font-size: 13.5px">
        Susunan mengikut peringkat, subjek dan kelas
      </p>
    </header>

    <div class="flex gap-2 flex-wrap">
      <button
        v-for="s in stageDefs"
        :key="s.key"
        type="button"
        class="font-bold cursor-pointer transition-colors"
        :style="{
          padding: '11px 18px',
          borderRadius: '999px',
          fontSize: '13px',
          background: stage === s.key ? 'var(--color-ink)' : 'var(--color-tile-inactive)',
          color: stage === s.key ? '#fff' : 'var(--color-ink-soft)',
        }"
        @click="pickStage(s.key)"
      >
        {{ s.label }}
        <span class="font-semibold" style="opacity: 0.7">· {{ s.range }}</span>
      </button>
    </div>

    <div class="grid gap-[18px] items-start" style="grid-template-columns: 1.4fr 1fr">
      <SyllabusBank :items="bank" :selected="selected" @select="selected = $event" />

      <section
        class="bg-surface"
        :style="{ border: '1px solid var(--color-border)', borderRadius: '20px', padding: '22px' }"
      >
        <div class="flex items-center gap-3" style="margin-bottom: 16px">
          <IconTile
            :icon="selMeta?.icon ?? '📘'"
            :tone="subjects.toneOf(selName)"
            :size="44"
            :radius="13"
          />
          <div>
            <div class="font-display font-semibold text-ink" style="font-size: 17px">{{ selName }}</div>
            <div class="text-muted font-semibold" style="font-size: 12px">
              {{ stageDef.label }} · {{ stageDef.range }}
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-[9px]" style="margin-bottom: 16px">
          <div
            v-for="cl in classList"
            :key="cl.name"
            class="flex items-center gap-3"
            :style="{
              padding: '12px 13px',
              borderRadius: '13px',
              background: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-divider)',
            }"
          >
            <div class="flex-1 min-w-0">
              <div class="font-bold text-ink" style="font-size: 13px">{{ cl.name }}</div>
              <div class="text-muted font-semibold" style="font-size: 11px">{{ cl.note }}</div>
            </div>
            <AppButton variant="outline" size="sm">📎 Bahan</AppButton>
          </div>
        </div>

        <button
          type="button"
          class="w-full cursor-pointer font-bold"
          :style="{
            border: '1.5px dashed var(--color-dashed)',
            background: 'var(--color-surface-lavender)',
            color: 'var(--color-fg-violet)',
            padding: '12px',
            borderRadius: '13px',
            fontSize: '12.5px',
          }"
        >
          + Lampirkan bahan
        </button>
      </section>
    </div>
  </div>
</template>
