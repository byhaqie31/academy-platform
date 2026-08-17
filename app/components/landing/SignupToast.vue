<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useSocialProof } from '~/composables/useSocialProof'
import {
  SOCIAL_PROOF_TIMING,
  hasMore,
  nextGapMs,
  noticeFor,
  subjectFromOfferTag,
} from '~/utils/socialProof'

// "Someone just registered" notices, one at a time, top right.
//
// The pool is seeded. Before a campaign runs as a paid ad it has to come from
// real enquiries: see the note on useSocialProof().

const props = defineProps<{
  /** The campaign's `offer.tag`, e.g. "Matematik · Tingkatan 4 dan 5". */
  offerTag: string
}>()

const { recent } = useSocialProof()
const subject = computed(() => subjectFromOfferTag(props.offerTag))

// Starts closed and stays closed until mounted. These pages are prerendered,
// so rendering a toast during SSR would put marketing noise in the static HTML
// and mismatch on hydration.
const shown = ref(0)
const visible = ref(false)
const dismissed = ref(false)
const reduceMotion = ref(false)

const notice = computed(() => {
  const signup = recent[shown.value - 1]
  return signup ? noticeFor(signup, subject.value) : null
})

let timers: ReturnType<typeof setTimeout>[] = []
const later = (fn: () => void, ms: number) => {
  timers.push(setTimeout(fn, ms))
}

function run() {
  if (dismissed.value || !hasMore(recent, shown.value)) return
  shown.value += 1
  visible.value = true
  later(() => {
    visible.value = false
    // Queue the next only after this one has cleared, so the gap is a gap
    // between toasts rather than between their start times.
    later(run, nextGapMs())
  }, SOCIAL_PROOF_TIMING.visibleMs)
}

function dismiss() {
  dismissed.value = true
  visible.value = false
  clearAll()
}

function clearAll() {
  for (const t of timers) clearTimeout(t)
  timers = []
}

onMounted(() => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  later(run, SOCIAL_PROOF_TIMING.firstDelayMs)
})

onBeforeUnmount(clearAll)
</script>

<template>
  <Transition :name="reduceMotion ? 'toast-fade' : 'toast-rise'">
    <div v-if="visible && notice" role="status" aria-live="polite" class="signup-toast">
      <div
        class="flex items-center gap-3"
        :class="{ 'signup-jiggle': !reduceMotion }"
        :style="{
          padding: '12px 14px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-card-hover)',
        }"
      >
        <span
          class="grid place-items-center shrink-0 font-bold text-white"
          :style="{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--brand-gradient)',
            fontSize: '15px',
          }"
        >{{ notice.initial }}</span>

        <span class="min-w-0">
          <b class="block text-ink truncate" style="font-size: 14px">{{ notice.title }}</b>
          <!-- Wraps rather than truncates: a long subject like Bahasa Inggeris
               would otherwise lose the "minit lalu" that makes it read as recent. -->
          <span class="block text-ink-soft" style="font-size: 12.5px; line-height: 1.45">
            {{ notice.detail }}
          </span>
        </span>

        <button
          type="button"
          aria-label="Tutup pemberitahuan"
          class="ml-auto shrink-0 grid place-items-center text-muted hover:text-ink"
          style="width: 24px; height: 24px"
          @click="dismiss"
        >
          <UIcon name="i-fluent-dismiss-16-regular" style="width: 14px; height: 14px" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.signup-toast {
  position: fixed;
  z-index: 40;
  right: 18px;
  /* 72px on a phone, where the toast is nearly full width and 18px would sit
     straight on top of the brand mark (which occupies 20-60px down the page).
     A landing page has no header, so that mark is the only branding there is. */
  top: calc(72px + env(safe-area-inset-top, 0px));
  max-width: min(380px, calc(100vw - 36px));
}

@media (min-width: 640px) {
  /* From sm up the toast is well right of the mark, so it can sit at the edge. */
  .signup-toast {
    top: calc(18px + env(safe-area-inset-top, 0px));
  }
}

/* A wobble once it has landed, so it catches the eye of someone already reading
   the page. On the inner card, never the positioned wrapper: the wrapper's
   transform belongs to the enter transition and the two would overwrite
   each other. The delay lets the slide finish first. */
.signup-jiggle {
  animation: signup-jiggle 0.7s ease-out 0.22s both;
}

@keyframes signup-jiggle {
  0% { transform: rotate(0) scale(1); }
  12% { transform: rotate(-3deg) scale(1.03); }
  26% { transform: rotate(2.4deg) scale(1.03); }
  40% { transform: rotate(-1.8deg) scale(1.015); }
  54% { transform: rotate(1.2deg) scale(1.01); }
  68% { transform: rotate(-0.6deg) scale(1); }
  100% { transform: rotate(0) scale(1); }
}

.toast-rise-enter-active,
.toast-rise-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
/* Drops in from above, since the toast now sits at the top edge. */
.toast-rise-enter-from,
.toast-rise-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* No travel for anyone who asked for less motion, only a fade. */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.2s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
}
</style>
