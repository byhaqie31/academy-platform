import { useAcademyStore } from '~/stores/academy'
import type { Faq } from '~/types'

// swap internals for API calls when backend lands; signature stays stable
/**
 * Frequently asked questions, keyed individually.
 *
 * Keys rather than arrays so the same store serves two surfaces: the website
 * renders the named `website` set, and a landing campaign names the five it
 * wants. Unknown keys are dropped rather than throwing, so a typo in a campaign
 * file costs one question, not the page.
 */
export function useFaqs() {
  const store = useAcademyStore()
  const all = store.faqs as Record<string, Faq>

  const byKeys = (keys: string[]): Faq[] =>
    keys.map((k) => all[k]).filter((f): f is Faq => Boolean(f))

  return {
    all,
    byKeys,
    /** a named set, e.g. 'website'. Empty array if the set does not exist. */
    set: (name: string) => byKeys(store.faqSets[name] ?? []),
  }
}
