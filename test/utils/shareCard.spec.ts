import { describe, it, expect } from 'vitest'
import { absoluteUrl, shareCardMeta } from '~/utils/shareCard'
import type { AcademySite } from '~/types/academy'

// Link previews are built by crawlers that never run our JavaScript and never
// resolve relative URLs. Every assertion here guards one of those two facts.

const site: AcademySite = {
  url: 'https://demo.hzacademy.my',
  ogImage: '/og/default.png',
  description: '{academy}, tuisyen online pilihan ibu bapa.',
  locale: 'ms_MY',
}

/** Reads a meta array back as a flat map so cases assert on content, not order. */
function contentOf(meta: Array<Record<string, string>>, key: string): string | undefined {
  return meta.find((m) => m.property === key || m.name === key)?.content
}

describe('absoluteUrl', () => {
  it('joins an origin and a route path', () => {
    expect(absoluteUrl(site.url, '/subjects')).toBe('https://demo.hzacademy.my/subjects')
  })

  it('keeps the root path as a bare trailing slash', () => {
    expect(absoluteUrl(site.url, '/')).toBe('https://demo.hzacademy.my/')
  })

  it('tolerates a trailing slash on the configured origin', () => {
    expect(absoluteUrl('https://demo.hzacademy.my/', '/fees')).toBe('https://demo.hzacademy.my/fees')
  })

  it('normalises a nested path with stray slashes', () => {
    expect(absoluteUrl(site.url, '/lp/ma-matematik-august/')).toBe(
      'https://demo.hzacademy.my/lp/ma-matematik-august',
    )
  })
})

describe('shareCardMeta', () => {
  const card = {
    title: 'Subjek dan tahap · Hz Academy',
    description: 'Semua subjek dari Tahun 1 hingga SPM.',
    path: '/subjects',
  }
  const head = shareCardMeta(card, site, 'Hz Academy')

  it('sets the document title from the card', () => {
    expect(head.title).toBe(card.title)
  })

  it('mirrors title and description into Open Graph and Twitter', () => {
    expect(contentOf(head.meta, 'description')).toBe(card.description)
    expect(contentOf(head.meta, 'og:title')).toBe(card.title)
    expect(contentOf(head.meta, 'og:description')).toBe(card.description)
    expect(contentOf(head.meta, 'twitter:title')).toBe(card.title)
    expect(contentOf(head.meta, 'twitter:description')).toBe(card.description)
  })

  it('makes og:url and og:image absolute', () => {
    expect(contentOf(head.meta, 'og:url')).toBe('https://demo.hzacademy.my/subjects')
    expect(contentOf(head.meta, 'og:image')).toBe('https://demo.hzacademy.my/og/default.png')
  })

  it('falls back to the site card when the page names no image', () => {
    expect(contentOf(head.meta, 'og:image')).toBe('https://demo.hzacademy.my/og/default.png')
  })

  it('uses a page-specific card when one is named', () => {
    const withImage = shareCardMeta({ ...card, image: '/og/ma-matematik-august.png' }, site, 'Hz Academy')
    expect(contentOf(withImage.meta, 'og:image')).toBe(
      'https://demo.hzacademy.my/og/ma-matematik-august.png',
    )
    expect(contentOf(withImage.meta, 'twitter:image')).toBe(
      'https://demo.hzacademy.my/og/ma-matematik-august.png',
    )
  })

  it('declares the card size, which is what makes WhatsApp render it large', () => {
    expect(contentOf(head.meta, 'og:image:width')).toBe('1200')
    expect(contentOf(head.meta, 'og:image:height')).toBe('630')
    expect(contentOf(head.meta, 'twitter:card')).toBe('summary_large_image')
  })

  it('carries the centre name and locale from config, not a literal', () => {
    expect(contentOf(head.meta, 'og:site_name')).toBe('Hz Academy')
    expect(contentOf(head.meta, 'og:locale')).toBe('ms_MY')
  })

  it('emits a canonical link at the absolute url', () => {
    expect(head.link).toEqual([{ rel: 'canonical', href: 'https://demo.hzacademy.my/subjects' }])
  })

  // Re-skinning for the next centre must stay a config edit, so no page spells
  // the centre's name. Same token the demo index copy already uses.
  // A page whose standfirst is optional and absent still has to share well.
  it('falls back to the configured description, token filled', () => {
    const bare = shareCardMeta({ title: 'Yuran · {academy}', path: '/fees' }, site, 'Hz Academy')
    expect(contentOf(bare.meta, 'description')).toBe('Hz Academy, tuisyen online pilihan ibu bapa.')
    expect(contentOf(bare.meta, 'og:description')).toBe(
      'Hz Academy, tuisyen online pilihan ibu bapa.',
    )
  })

  it('fills the {academy} token in both title and description', () => {
    const tokened = shareCardMeta(
      { title: '{academy} · Tuisyen online', description: 'Pusat tuisyen {academy}.', path: '/' },
      site,
      'Hz Academy',
    )
    expect(tokened.title).toBe('Hz Academy · Tuisyen online')
    expect(contentOf(tokened.meta, 'og:title')).toBe('Hz Academy · Tuisyen online')
    expect(contentOf(tokened.meta, 'description')).toBe('Pusat tuisyen Hz Academy.')
    expect(contentOf(tokened.meta, 'og:description')).toBe('Pusat tuisyen Hz Academy.')
  })
})
