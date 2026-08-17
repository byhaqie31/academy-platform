<script setup lang="ts">
import ContactPanel from '~/components/marketing/ContactPanel.vue'
import EnquiryForm from '~/components/marketing/EnquiryForm.vue'
import { useSiteContent } from '~/composables/useSiteContent'

// WhatsApp first, form second. Most parents will tap the green button; the form
// is there for the ones who would rather not start a conversation.
definePageMeta({ layout: 'marketing' })

const { contact } = useSiteContent()

useShareCard({
  path: '/contact',
  title: 'Hubungi kami · {academy}',
  description: contact.section.lede,
})
</script>

<template>
  <section class="mx-auto" style="max-width: 1120px; padding: 60px 22px 76px">
    <div class="grid gap-12 lg:grid-cols-2 items-start">
      <ContactPanel />
      <EnquiryForm />
    </div>
  </section>
</template>
