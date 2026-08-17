<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SectionHeading from '~/components/ui/SectionHeading.vue'
import Testimonials from '~/components/marketing/Testimonials.vue'
import StepCards from '~/components/marketing/StepCards.vue'
import FaqAccordion from '~/components/marketing/FaqAccordion.vue'
import LandingHero from '~/components/landing/LandingHero.vue'
import LandingOffer from '~/components/landing/LandingOffer.vue'
import LandingIncluded from '~/components/landing/LandingIncluded.vue'
import LandingFinalCta from '~/components/landing/LandingFinalCta.vue'
import SignupToast from '~/components/landing/SignupToast.vue'
import TrustMarquee from '~/components/landing/TrustMarquee.vue'
import { useAcademy } from '~/composables/useAcademy'
import { useLandings } from '~/composables/useLandings'

// One template, every campaign. Adding a campaign is a new file in
// app/content/landings/ plus a registry line. Nothing in here changes.
definePageMeta({ layout: 'landing' })

const route = useRoute()
const { academy } = useAcademy()
const { bySlug, resolve, chrome } = useLandings()

const campaign = bySlug(String(route.params.slug))

// An unknown slug is a real 404, not an empty page. A mistyped ad URL should
// fail loudly while the campaign is still cheap to fix.
if (!campaign) {
  throw createError({
    statusCode: 404,
    statusMessage: `Unknown campaign: ${String(route.params.slug)}`,
    fatal: true,
  })
}

const resolved = computed(() => resolve(campaign))

// Prefilled WhatsApp message naming the campaign, so whoever answers knows
// which ad the enquiry came from without asking.
const waHref = computed(() => {
  const text = `Salam, saya berminat dengan ${campaign.seo.title}`
  return `https://wa.me/${academy.contact.whatsapp}?text=${encodeURIComponent(text)}`
})

// A campaign link is pasted into WhatsApp far more often than it is typed, so
// the card a parent sees names the campaign rather than the centre in general.
useShareCard({
  path: `/lp/${campaign.slug}`,
  title: `${campaign.seo.title} · ${academy.name}`,
  description: campaign.seo.description,
  image: campaign.seo.image,
})
</script>

<template>
  <div>
    <!-- 1 hero -->
    <LandingHero
      :campaign="campaign"
      :stats="resolved.stats"
      :seats-pct="resolved.seatsPct"
      :seats-label="chrome.seatsLabel"
      :wa-href="waHref"
    />

    <!-- 2 trust strip, on one self-scrolling line -->
    <TrustMarquee :claims="chrome.trustClaims" />

    <!-- 3 proof. Testimonials brings its own section and padding. -->
    <div style="padding-top: 76px">
      <Testimonials :items="resolved.testimonials" />
    </div>

    <!-- 4 how it works -->
    <section :style="{ background: 'var(--color-surface-lavender)' }">
      <div class="mx-auto" style="max-width: 1060px; padding: 76px 22px">
        <SectionHeading
          center
          :label="chrome.howSection.eyebrow"
          :title="chrome.howSection.title"
          :sub="chrome.howSection.lede"
          class="mb-11"
        />
        <StepCards :steps="chrome.howSteps" />
      </div>
    </section>

    <!-- 5 what is included -->
    <LandingIncluded
      :section="chrome.includedSection"
      :items="campaign.included"
      :cta-label="campaign.cta.label"
    />

    <!-- 6 the offer -->
    <LandingOffer :campaign="campaign" :seats-left="resolved.seatsLeft" :copy="chrome.offer" />

    <!-- 7 objections -->
    <section class="mx-auto" style="max-width: 820px; padding: 0 22px 76px">
      <SectionHeading
        center
        :label="chrome.faqSection.eyebrow"
        :title="chrome.faqSection.title"
        class="mb-11"
      />
      <FaqAccordion :faqs="resolved.faqs" />
    </section>

    <!-- 8 final CTA -->
    <LandingFinalCta
      :campaign="campaign"
      :section="chrome.finalSection"
      :labels="chrome.formLabels"
      :consent-label="chrome.consentLabel"
      :wa-href="waHref"
    />

    <!-- Minimal footer. No link farm: this page has one exit. -->
    <footer :style="{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }">
      <div
        class="mx-auto flex flex-wrap items-center justify-between gap-3 text-muted"
        style="max-width: 1060px; padding: 30px 22px; font-size: 13.5px"
      >
        <span>© {{ academy.since }} to 2026 {{ academy.name }}. {{ chrome.footerNote }}</span>
        <span>{{ academy.contact.email }}</span>
      </div>
    </footer>

    <!-- Recent registrations, one at a time, top right. Seeded: see
         useSocialProof() before this campaign runs as a paid ad. -->
    <SignupToast :offer-tag="campaign.offer.tag" />
  </div>
</template>
