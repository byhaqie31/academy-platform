<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useSubjects } from '~/composables/useSubjects'
import { buildHeroBackdrop } from '~/utils/heroBackdrop'
// Type only, so gsap itself still arrives through the dynamic import below and
// never lands in the bundle for a visitor who asked for reduced motion.
import type gsapLib from 'gsap'

type Tween = ReturnType<typeof gsapLib.to>

// Decoration only: subject icons drifting in the hero's margins. Positions and
// cycles live in utils/heroBackdrop.ts, where they are unit tested for staying
// clear of the copy. This component only renders them and drives the motion.

const { all } = useSubjects()
const icons = buildHeroBackdrop(all)

const rootEl = ref<HTMLElement | null>(null)
let cleanup: (() => void) | null = null

onMounted(async () => {
  const root = rootEl.value
  if (!root) return
  // Two reasons not to animate: the visitor asked for less motion, or the
  // icons are hidden anyway below lg, where the layout stacks and the margins
  // this field lives in no longer exist.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!window.matchMedia('(min-width: 1024px)').matches) return

  const { default: gsap } = await import('gsap')
  const els = Array.from(root.children) as HTMLElement[]
  const tweens: Tween[] = []
  for (const [i, el] of els.entries()) {
    const slot = icons[i]
    if (!slot) continue
    tweens.push(gsap.to(el, {
      x: slot.driftX,
      y: slot.driftY,
      rotation: slot.rotate,
      duration: slot.duration,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    }))
  }

  // An idle marketing page should cost nothing, so the field stops once the
  // hero is scrolled past rather than looping for the whole visit.
  const io = new IntersectionObserver(([entry]) => {
    for (const t of tweens) entry?.isIntersecting ? t.play() : t.pause()
  })
  io.observe(root)

  cleanup = () => {
    io.disconnect()
    for (const t of tweens) t.kill()
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div
    ref="rootEl"
    aria-hidden="true"
    class="hero-backdrop hidden lg:block absolute inset-0 overflow-hidden"
    style="pointer-events: none"
  >
    <UIcon
      v-for="(ic, i) in icons"
      :key="i"
      :name="ic.icon"
      class="absolute text-ink"
      :style="{
        left: ic.left,
        top: `${ic.topPct}%`,
        width: `${ic.size}px`,
        height: `${ic.size}px`,
        opacity: ic.opacity,
        // Centred with negative margins, not a translate: GSAP owns `transform`
        // on these elements and would overwrite the centering on its first tick.
        marginLeft: `${-ic.size / 2}px`,
        marginTop: `${-ic.size / 2}px`,
      }"
    />
  </div>
</template>
