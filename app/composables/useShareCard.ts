import { useAcademy } from './useAcademy'
import { shareCardMeta, type ShareCard } from '~/utils/shareCard'

/**
 * Sets a page's title, description and link-preview tags in one call.
 *
 * Every public page goes through here rather than calling `useHead()` directly,
 * so the origin, the default card and the locale stay in `config/academy.ts`
 * and no page ever hardcodes them.
 *
 * Only works on prerendered routes. A route rendered client-side has no HTML
 * for a crawler to read, so its tags are invisible to WhatsApp and Facebook
 * however correct they look in the browser. See `routeRules` in nuxt.config.
 */
export function useShareCard(card: ShareCard) {
  const { academy } = useAcademy()
  useHead(shareCardMeta(card, academy.site, academy.name))
}
