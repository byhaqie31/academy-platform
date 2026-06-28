<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import SiteHeader from '~/components/marketing/SiteHeader.vue'
import SiteFooter from '~/components/marketing/SiteFooter.vue'

// Motion lives on the marketing surface only. Dashboards stay calm and fast.
const mainEl = ref<HTMLElement | null>(null)
let cleanup: (() => void) | null = null

onMounted(async () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !mainEl.value) return

  const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
    import('lenis'),
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ])
  gsap.registerPlugin(ScrollTrigger)

  const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
  let rafId = 0
  const raf = (time: number) => {
    lenis.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)
  lenis.on('scroll', ScrollTrigger.update)

  // Each top-level section fades up as it enters the viewport.
  const sections = Array.from(mainEl.value.children) as HTMLElement[]
  const tweens = sections.map((el) =>
    gsap.from(el, {
      y: 28,
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
    }),
  )

  cleanup = () => {
    cancelAnimationFrame(rafId)
    tweens.forEach((t) => t.scrollTrigger?.kill())
    tweens.forEach((t) => t.kill())
    lenis.destroy()
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div class="min-h-screen bg-surface">
    <SiteHeader />
    <main ref="mainEl">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<style>
/* Lenis recommended base so smooth scroll and anchor behaviour cooperate. */
html.lenis,
html.lenis body {
  height: auto;
}
.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}
.lenis.lenis-stopped {
  overflow: hidden;
}
</style>
