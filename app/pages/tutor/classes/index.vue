<script setup lang="ts">
import { computed } from 'vue'
import { useEducators } from '~/composables/useEducators'
import { useClasses } from '~/composables/useClasses'
import ClassCard from '~/components/tutor/ClassCard.vue'

definePageMeta({ layout: 'tutor' })

const self = useEducators().self()
const myClasses = useClasses().forEducator(self.id)

const classCount = computed(() => myClasses.length)
const studentCount = computed(() => myClasses.reduce((t, c) => t + c.roster.length, 0))
</script>

<template>
  <div class="flex flex-col gap-5">
    <header class="flex items-end justify-between gap-3.5 flex-wrap">
      <div>
        <h1 class="font-display font-bold text-ink" style="font-size: 28px; line-height: 1.1">
          Classes and students
        </h1>
        <p class="text-muted" style="font-size: 13.5px; font-weight: 600; margin-top: 4px">
          {{ classCount }} classes · {{ studentCount }} students under your guidance
        </p>
      </div>
    </header>

    <div
      class="grid"
      style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px"
    >
      <ClassCard v-for="c in myClasses" :key="c.id" :cls="c" />
    </div>
  </div>
</template>
