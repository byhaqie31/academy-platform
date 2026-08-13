<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import IconTile from './IconTile.vue'
import type { AppNotification } from '~/composables/useNotifications'

const props = defineProps<{ items: AppNotification[] }>()

// local copy so the mockup can toggle read state without a backend
const list = reactive(props.items.map((n) => ({ ...n })))
const unread = computed(() => list.filter((n) => n.unread).length)

const open = ref(false)
const root = ref<HTMLElement | null>(null)

function markRead(n: { unread: boolean }) {
  n.unread = false
}
function markAll() {
  list.forEach((n) => (n.unread = false))
}

function onDocClick(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div ref="root" class="relative">
    <button
      class="relative grid place-items-center cursor-pointer"
      aria-label="Notifications"
      :aria-expanded="open"
      :style="{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--color-bg-app)' }"
      @click="open = !open"
    >
      <UIcon name="i-fluent-alert-20-regular" class="shrink-0" :style="{ width: '18px', height: '18px' }" />
      <span
        v-if="unread"
        class="absolute"
        :style="{ top: '9px', right: '10px', width: '7px', height: '7px', borderRadius: '999px', background: 'var(--color-accent-pink)' }"
      />
    </button>

    <div
      v-if="open"
      class="absolute right-0 mt-2 bg-surface hz-pop z-50"
      :style="{ width: '340px', borderRadius: '18px', boxShadow: 'var(--shadow-dropdown)', padding: '8px' }"
    >
      <div class="flex items-center justify-between px-3 pt-2 pb-1">
        <div class="flex items-center gap-2">
          <span class="font-display font-bold text-ink" style="font-size: 14px">Notifications</span>
          <span
            v-if="unread"
            class="font-bold text-white"
            :style="{ padding: '2px 8px', borderRadius: '999px', fontSize: '11px', background: 'var(--color-accent-pink)' }"
          >
            {{ unread }} new
          </span>
        </div>
        <button
          v-if="unread"
          class="font-bold cursor-pointer transition-colors"
          :style="{ fontSize: '11.5px', color: 'var(--color-brand-deep)', background: 'transparent' }"
          @click="markAll"
        >
          Mark all as read
        </button>
      </div>

      <div class="mt-1" style="max-height: 360px; overflow-y: auto">
        <button
          v-for="n in list"
          :key="n.id"
          class="w-full flex items-start gap-3 text-left cursor-pointer transition-colors hover:bg-[var(--color-surface-lavender)]"
          :style="{ padding: '10px', borderRadius: '12px', background: n.unread ? 'var(--color-surface-lavender)' : 'transparent' }"
          @click="markRead(n)"
        >
          <IconTile :icon="n.icon" :tone="n.tone" :size="38" :radius="11" />
          <span class="min-w-0 flex-1">
            <span class="flex items-center gap-2">
              <span class="block font-bold text-ink truncate" style="font-size: 13px">{{ n.title }}</span>
              <span
                v-if="n.unread"
                class="shrink-0"
                :style="{ width: '6px', height: '6px', borderRadius: '999px', background: 'var(--color-accent-pink)' }"
              />
            </span>
            <span class="block font-semibold text-ink-soft" style="font-size: 12px; line-height: 1.4">{{ n.desc }}</span>
            <span class="block font-semibold text-faintest mt-1" style="font-size: 11px">{{ n.time }}</span>
          </span>
        </button>
      </div>

      <button
        class="block w-full text-center font-bold text-ink-soft cursor-pointer transition-colors hover:text-ink mt-1"
        :style="{ padding: '10px', borderRadius: '12px', fontSize: '12.5px', background: 'transparent' }"
        @click="open = false"
      >
        See all notifications
      </button>
    </div>
  </div>
</template>
