// Seed for the /demo directory: the internal index of everything built so far.
//
// Deliberately NOT linked from the public site. A visitor arriving from an ad
// must land on a business, not a menu of prototypes.
//
// English, unlike the marketing pages. This is build-status chrome for a
// stakeholder walkthrough, the same category as the admin and tutor portals.
//
// Portal entries are NOT listed here. They are derived from adminNav and
// tutorNav in useDemoIndex() so this file cannot drift from the real nav; only
// the one-line notes are keyed by route below.

import type { DemoEntry, DemoGroup } from '~/types/site'

const demoIntro = {
  eyebrow: 'Prototype walkthrough',
  // {academy} is replaced from config/academy.ts. The centre name is never
  // written into copy, so re-skinning stays a config edit.
  titleTemplate: 'Hello {academy} team 👋',
  lede:
    'This is everything we have built for you so far. Nothing here is fragile, so click around '
    + 'freely: it is a prototype filled with sample data, and nothing you do can break it or '
    + 'affect real students.',
  tips: [
    { icon: 'i-fluent-open-20-regular', title: 'Open walks you through it', body: 'You see exactly what a parent, an admin or a tutor would see.' },
    { icon: 'i-fluent-folder-open-20-regular', title: 'See screens lists what is inside', body: 'Every screen in that module, with a line on what each one proves.' },
    { icon: 'i-fluent-arrow-up-20-regular', title: 'The Screens tab follows you', body: 'It sits at the bottom of every page and brings you back here.' },
    // Hidden once nothing is planned, so the page never explains a state it is
    // not in.
    { icon: 'i-fluent-wrench-20-regular', title: 'Planned means quoted, not built', body: 'Those screens are specified and priced, and come in the next phase.', whenPlanned: true },
  ],
}

/** One line per route, saying what that screen proves. */
const demoNotes: Record<string, string> = {
  // Marketing
  '/': 'The page an ad click or a WhatsApp share lands on',
  '/subjects': 'Every subject, grouped by KPM stage, with a blurb per stage',
  '/how-it-works': 'Answers the biggest objection to an online centre',
  '/tutors': 'Who actually teaches. Trust in an online centre lives here',
  '/fees': 'Prices stated plainly, with discounts and payment methods',
  '/contact': 'WhatsApp first, enquiry form second',
  '/register': 'Five-step interest form, ending on WhatsApp',
  // Admin
  '/admin': 'Tonight, the collection cycle and centre-wide revenue, on one screen',
  '/admin/tonight': 'Live ops from 7:30pm: who is in which room, and what is wrong',
  '/admin/students': 'Student and guardian records, with a detail view each',
  '/admin/educators': 'Tutor records, hours taught and derived pay',
  '/admin/timetable': 'The weekly grid, with licences used against licences available',
  '/admin/schedule': 'The weekly grid across every class, plus lesson plans',
  '/admin/syllabus': 'KPM syllabus tree and the material bank',
  '/admin/collection': 'The 1st to the 7th, where the whole month gets collected',
  '/admin/billing': 'Invoices, outstanding balances and payment proof',
  '/admin/payroll': 'Pay derived from recorded sessions, never hand-entered',
  '/admin/settings': 'Zoom, Microsoft and WhatsApp integration toggles',
  // Tutor
  '/tutor': "What a tutor sees first: today's classes and pay so far",
  '/tutor/schedule': 'The tutor\'s own week, nothing else',
  '/tutor/classes': 'Class rosters and live attendance marking',
  '/tutor/lesson-plans': 'Plans for the week ahead',
  '/tutor/earnings': 'Payslip. Reconciles exactly with the admin payroll screen',
  // Parent
  '/portal/parent': 'What a parent actually opens: one screen, three answers',
  '/portal/parent/suspended': 'The 9th of the month, and the two taps back in',
  '/portal/login': 'The portal door. No password, a link sent to WhatsApp',
  // Archive
  '/v1': 'The first mockup, frozen. English, branch-based, one long page',
}

const marketingEntries: DemoEntry[] = [
  { label: 'Laman utama', to: '/', note: demoNotes['/']!, status: 'live' },
  { label: 'Subjek', to: '/subjects', note: demoNotes['/subjects']!, status: 'live' },
  { label: 'Cara ia berfungsi', to: '/how-it-works', note: demoNotes['/how-it-works']!, status: 'live' },
  { label: 'Cikgu', to: '/tutors', note: demoNotes['/tutors']!, status: 'live' },
  { label: 'Yuran', to: '/fees', note: demoNotes['/fees']!, status: 'live' },
  { label: 'Hubungi', to: '/contact', note: demoNotes['/contact']!, status: 'live' },
  { label: 'Daftar minat', to: '/register', note: demoNotes['/register']!, status: 'live' },
]

const parentEntries: DemoEntry[] = [
  { label: 'Portal login', to: '/portal/login', note: demoNotes['/portal/login']!, status: 'live' },
  { label: 'Parent home', to: '/portal/parent', note: demoNotes['/portal/parent']!, status: 'live' },
  { label: 'Suspended and back', to: '/portal/parent/suspended', note: demoNotes['/portal/parent/suspended']!, status: 'live' },
]

const archiveEntries: DemoEntry[] = [
  { label: 'v1 marketing site', to: '/v1', note: demoNotes['/v1']!, status: 'live' },
]

// Client-facing paperwork, served from public/documents/. The discovery
// questionnaire is deliberately not published here: it is a working document
// for the engagement, not something to hand over in a walkthrough.
const documentEntries: DemoEntry[] = [
  {
    label: 'Proposal',
    to: '/documents/proposal.pdf',
    note: 'The full proposal: scope, approach and what each phase delivers',
    status: 'live',
    external: true,
  },
  {
    label: 'Quotation',
    to: '/documents/quotation.pdf',
    note: 'Three options with pricing, and the signature block',
    status: 'live',
    external: true,
  },
]

// Campaign pages. One template, one data file each.
const landingEntries: DemoEntry[] = [
  {
    label: 'Matematik SPM, Ogos',
    to: '/lp/ma-matematik-august',
    note: 'Menengah Atas campaign. No navigation, one exit, one repeated call to action',
    status: 'live',
  },
  {
    label: 'Matematik sekolah rendah, Ogos',
    to: '/lp/rendah-matematik-august',
    note: 'Same template, different audience. A third campaign is a data file, not a build',
    status: 'live',
  },
]

/** Groups whose entries are fixed. Admin and tutor are derived in the composable. */
const demoGroups: DemoGroup[] = [
  {
    key: 'marketing',
    title: 'Marketing website',
    badge: 'current',
    note: 'Malay, public, six pages. What a parent sees.',
    icon: 'i-fluent-globe-24-regular',
    tone: 'violet',
    primaryTo: '/',
    primaryLabel: 'Open the website',
    feature: true,
    entries: marketingEntries,
  },
  {
    key: 'landing',
    title: 'Campaign landing pages',
    note: 'One page per ad campaign, driven by a data file. No navigation by design.',
    icon: 'i-fluent-target-24-regular',
    tone: 'pink',
    primaryTo: '/lp/ma-matematik-august',
    primaryLabel: 'Open the SPM campaign',
    entries: landingEntries,
  },
  {
    key: 'admin',
    title: 'Admin portal',
    note: 'English. What the centre owner and admin staff run the day on.',
    icon: 'i-fluent-data-bar-vertical-24-regular',
    tone: 'blue',
    primaryTo: '/admin',
    primaryLabel: 'Open the admin portal',
    entries: [],
  },
  {
    key: 'tutor',
    title: 'Tutor portal',
    note: 'English. What keeps tutors in the system every week.',
    icon: 'i-fluent-people-24-regular',
    tone: 'green',
    primaryTo: '/tutor',
    primaryLabel: 'Open the tutor portal',
    entries: [],
  },
  {
    key: 'parent',
    title: 'Parent portal',
    badge: 'phase 2',
    note: 'The door, the home screen and the recovery flow. Where the product is felt day to day.',
    icon: 'i-fluent-people-community-24-regular',
    tone: 'amber',
    primaryTo: '/portal/login',
    primaryLabel: 'Open the parent portal',
    entries: parentEntries,
  },
  {
    key: 'archive',
    title: 'Archive',
    badge: 'v1',
    note: 'The previous mockup, frozen exactly as it was shown.',
    icon: 'i-fluent-box-24-regular',
    tone: 'indigo',
    primaryTo: '/v1',
    primaryLabel: 'Open the v1 site',
    entries: archiveEntries,
  },
  {
    key: 'documents',
    title: 'Documents',
    note: 'The proposal and the quotation, if you want them to hand.',
    icon: 'i-fluent-document-24-regular',
    tone: 'rose',
    primaryTo: '/documents/proposal.pdf',
    primaryLabel: 'Open the proposal',
    primaryExternal: true,
    entries: documentEntries,
  },
]

export const demoIndex = {
  demoIntro,
  demoNotes,
  demoGroups,
}
