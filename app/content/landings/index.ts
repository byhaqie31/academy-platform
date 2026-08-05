// Campaign registry: slug -> campaign.
//
// THIS FILE AND A NEW CAMPAIGN FILE ARE THE ONLY EDITS A NEW CAMPAIGN NEEDS.
// If a campaign ever requires a component change, the template is not finished
// and the change belongs in the template, not in the campaign.
//
// Typed modules rather than @nuxt/content: adding a content pipeline is not
// worth a dependency for six files, and this keeps the data seam intact.
// Components never import from here; they go through useLandings().

import type { LandingCampaign } from '~/types'
import { campaign as maMatematikAugust } from './ma-matematik-august'
import { campaign as rendahMatematikAugust } from './rendah-matematik-august'

export const landingCampaigns: Record<string, LandingCampaign> = {
  [maMatematikAugust.slug]: maMatematikAugust,
  [rendahMatematikAugust.slug]: rendahMatematikAugust,
}
