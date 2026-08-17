// Branding + tenant identity types. The whole point of the config seam is that
// re-skinning for the next centre is a config edit, not a refactor.

export interface Branch {
  id: string
  name: string
  short: string
  hours: string
  area: string
}

export interface AcademyContact {
  whatsapp: string
  whatsappLabel: string
  phone: string
  email: string
  web: string
}

/**
 * Everything a link preview needs. Lives in config because the origin and the
 * default card are centre-specific: re-skinning swaps these two strings.
 */
export interface AcademySite {
  /** Origin the share cards point at. Absolute, scheme included. */
  url: string
  /** Default share card, served from public/. 1200x630 PNG. */
  ogImage: string
  /** Used when a page has no standfirst of its own. Never ship an empty card. */
  description: string
  /** Open Graph locale for the public surfaces, which are Malay. */
  locale: string
}

export interface Academy {
  name: string
  shortName: string
  tagline: string
  motto: string
  logoText: string
  since: number
  contact: AcademyContact
  site: AcademySite
  branches: Branch[]
}
