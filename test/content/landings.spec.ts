import { describe, expect, it } from 'vitest'
import { landingCampaigns } from '~/content/landings'
import { siteContent } from '~/stores/siteContent'

// These guard the two things a type cannot: that the slug's parts actually
// match the campaign's own fields, and that every key a campaign references
// resolves against the shared pools. Both fail silently at runtime otherwise,
// a typo'd FAQ key just renders one fewer question.

const campaigns = Object.entries(landingCampaigns)

describe('landing campaign registry', () => {
  it('ships at least the two example campaigns', () => {
    expect(campaigns.length).toBeGreaterThanOrEqual(2)
  })

  it('keys the registry by each campaign\'s own slug', () => {
    for (const [key, campaign] of campaigns) expect(key).toBe(campaign.slug)
  })
})

describe('slug convention <level>-<subject>-<campaign>', () => {
  it.each(campaigns)('%s is built from its own fields', (_key, campaign) => {
    expect(campaign.slug).toBe(`${campaign.level}-${campaign.subject}-${campaign.campaign}`)
  })

  it.each(campaigns)('%s is lowercase and hyphenated', (_key, campaign) => {
    expect(campaign.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)+$/)
  })
})

describe('campaign key references resolve', () => {
  it.each(campaigns)('%s references only known FAQs', (_key, campaign) => {
    const known = Object.keys(siteContent.faqs)
    const missing = campaign.faqs.filter((k) => !known.includes(k))
    expect(missing).toEqual([])
  })

  it.each(campaigns)('%s references only known testimonials', (_key, campaign) => {
    const known = siteContent.siteTestimonials.map((t) => t.id)
    const missing = campaign.proof.testimonials.filter((id) => !known.includes(id))
    expect(missing).toEqual([])
  })

  it.each(campaigns)('%s references only known stats', (_key, campaign) => {
    const known = Object.keys(siteContent.landingStats)
    const missing = campaign.proof.stats.filter((k) => !known.includes(k))
    expect(missing).toEqual([])
  })
})

describe('campaign content is complete enough to sell', () => {
  it.each(campaigns)('%s has an offer that adds up', (_key, campaign) => {
    expect(campaign.offer.seatsTaken).toBeLessThanOrEqual(campaign.offer.seatsTotal)
    expect(campaign.offer.price).toBeGreaterThan(0)
    expect(campaign.offer.includes.length).toBeGreaterThan(0)
  })

  it.each(campaigns)('%s has pills, a headline and SEO', (_key, campaign) => {
    expect(campaign.pills.length).toBeGreaterThan(0)
    expect(campaign.headline.trim()).not.toBe('')
    expect(campaign.headlineAccent.trim()).not.toBe('')
    expect(campaign.seo.title.trim()).not.toBe('')
    expect(campaign.seo.description.trim()).not.toBe('')
  })

  it.each(campaigns)('%s offers at least one level in the form', (_key, campaign) => {
    expect(campaign.form.levelOptions.length).toBeGreaterThan(0)
  })
})
