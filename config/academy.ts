import type { Academy } from '~/types/academy'

// Single source of truth for everything centre-specific. Nothing about Hz
// Academy should appear anywhere else in the codebase. Re-skinning for the next
// centre is an edit here, not a refactor.
export const academy: Academy = {
  name: 'Hz Academy',
  shortName: 'Hz',
  tagline: 'Trusted since 2014',
  motto: 'Simple, effortless, human.',
  logoText: 'Hz',
  since: 2014,
  contact: {
    whatsapp: '60123456789',
    whatsappLabel: '012-345 6789',
    phone: '012-345 6789',
    email: 'hello@hzacademy.my',
    web: 'axelnovaventures.com',
  },
  branches: [
    { id: 'kw', name: 'Kota Warisan, Sepang', short: 'Kota Warisan', area: 'Sepang', hours: 'Mon to Sat · 3PM–9PM' },
    { id: 'sk', name: 'Taman Sutera, Kajang', short: 'Kajang', area: 'Kajang', hours: 'Mon to Sat · 2PM–9PM' },
    { id: 'ix', name: 'Taman Ixora', short: 'Ixora', area: 'Seri Kembangan', hours: 'Mon to Sun · 3PM–9PM' },
    { id: 'pk', name: 'Pekan', short: 'Pekan', area: 'Pahang', hours: 'Mon to Sat · 3PM–8PM' },
  ],
}
