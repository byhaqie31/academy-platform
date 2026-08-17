import type { AcademySite } from '~/types/academy'

// What a page contributes to its own link preview. The card is the unit a page
// thinks in: a title, a line of description, and optionally its own image.
export interface ShareCard {
  /** Document title. May carry the `{academy}` token, as demo copy does. */
  title: string
  /**
   * May carry the `{academy}` token. Optional because a page's standfirst is,
   * and a page with no line of its own still deserves a card that reads.
   */
  description?: string
  /** Route path this card describes, e.g. `/` or `/lp/ma-matematik-august`. */
  path: string
  /** Root-relative image path. Falls back to the configured site card. */
  image?: string
}

/**
 * Crawlers resolve neither relative `og:image` nor relative `og:url`, so every
 * URL a card emits is absolutised against the configured origin.
 */
export function absoluteUrl(base: string, path: string): string {
  const origin = base.replace(/\/+$/, '')
  const clean = path.replace(/^\/+|\/+$/g, '')
  return clean ? `${origin}/${clean}` : `${origin}/`
}

/**
 * Builds the head for one page's link preview.
 *
 * Kept as a pure function rather than folded into the composable so the tag set
 * is testable without mounting Nuxt. `useShareCard()` is the thin wrapper that
 * feeds it config and hands the result to `useHead()`.
 */
export function shareCardMeta(card: ShareCard, site: AcademySite, academyName: string) {
  const url = absoluteUrl(site.url, card.path)
  const image = absoluteUrl(site.url, card.image ?? site.ogImage)
  // Same `{academy}` token the demo index copy uses, so a page never spells the
  // centre's name and re-skinning stays a config edit.
  const fill = (s: string) => s.replaceAll('{academy}', academyName)
  const title = fill(card.title)
  const description = fill(card.description ?? site.description)

  return {
    title,
    link: [{ rel: 'canonical', href: url }],
    meta: [
      { name: 'description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: academyName },
      { property: 'og:locale', content: site.locale },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      // WhatsApp renders the small card, not the large one, when it cannot
      // work out the image size before it finishes fetching. Declaring it is
      // the difference between a thumbnail and a banner in the chat.
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: title },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
  }
}
