import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { landingCampaigns } from '~/content/landings'
import { academy } from '~~/config/academy'

// The share cards are committed PNGs rendered by scripts/og-cards.mjs, so a
// campaign can point at a card nobody ever rendered and nothing complains until
// a parent sees a broken preview in WhatsApp. These are the checks that fail
// loudly instead.

const publicDir = resolve(process.cwd(), 'public')

/** Reads width and height out of a PNG's IHDR chunk, which is always first. */
function pngSize(path: string): { width: number, height: number } {
  const buf = readFileSync(path)
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
}

const cards = [
  ['site default', academy.site.ogImage],
  ...Object.values(landingCampaigns)
    .filter((c) => c.seo.image)
    .map((c) => [c.slug, c.seo.image as string] as const),
] as ReadonlyArray<readonly [string, string]>

describe('share cards', () => {
  it('covers the site default and both campaigns', () => {
    expect(cards.length).toBeGreaterThanOrEqual(3)
  })

  it.each(cards)('%s card exists at %s', (_name, image) => {
    expect(existsSync(resolve(publicDir, image.replace(/^\//, '')))).toBe(true)
  })

  // Facebook and WhatsApp only render the large card at this ratio. Anything
  // else silently degrades to a thumbnail next to the link.
  it.each(cards)('%s card is 1200x630', (_name, image) => {
    expect(pngSize(resolve(publicDir, image.replace(/^\//, '')))).toEqual({
      width: 1200,
      height: 630,
    })
  })

  // WhatsApp gives up on images it cannot fetch quickly, and shows no card.
  it.each(cards)('%s card is under 300 KB', (_name, image) => {
    const bytes = readFileSync(resolve(publicDir, image.replace(/^\//, ''))).byteLength
    expect(bytes).toBeLessThan(300 * 1024)
  })
})

describe('site config', () => {
  it('points at an absolute https origin, which og:url requires', () => {
    expect(academy.site.url).toMatch(/^https:\/\/[^/]+$/)
  })
})
