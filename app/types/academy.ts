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

export interface Academy {
  name: string
  shortName: string
  tagline: string
  motto: string
  logoText: string
  since: number
  contact: AcademyContact
  branches: Branch[]
}
