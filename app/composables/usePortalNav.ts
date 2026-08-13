export interface NavItem {
  to: string
  /** Fluent base name WITHOUT variant suffix, e.g. 'i-fluent-grid-24'.
   *  Renderers append '-regular' or '-filled' (active). */
  icon: string
  label: string
}

export const adminNav: NavItem[] = [
  { to: '/admin', icon: 'i-fluent-grid-24', label: 'Dashboard' },
  { to: '/admin/tonight', icon: 'i-fluent-video-24', label: 'Tonight' },
  { to: '/admin/students', icon: 'i-fluent-hat-graduation-24', label: 'Students' },
  { to: '/admin/educators', icon: 'i-fluent-people-24', label: 'Educators' },
  { to: '/admin/timetable', icon: 'i-fluent-table-24', label: 'Timetable' },
  { to: '/admin/schedule', icon: 'i-fluent-calendar-ltr-24', label: 'Schedule' },
  { to: '/admin/syllabus', icon: 'i-fluent-book-24', label: 'Syllabus' },
  { to: '/admin/collection', icon: 'i-fluent-receipt-24', label: 'Collection week' },
  { to: '/admin/billing', icon: 'i-fluent-payment-24', label: 'Billing' },
  { to: '/admin/payroll', icon: 'i-fluent-money-24', label: 'Payroll' },
  { to: '/admin/branches', icon: 'i-fluent-location-24', label: 'Branches' },
  { to: '/admin/settings', icon: 'i-fluent-settings-24', label: 'Settings' },
]

export const tutorNav: NavItem[] = [
  { to: '/tutor', icon: 'i-fluent-grid-24', label: 'Dashboard' },
  { to: '/tutor/schedule', icon: 'i-fluent-calendar-ltr-24', label: 'My schedule' },
  { to: '/tutor/classes', icon: 'i-fluent-book-24', label: 'Classes and students' },
  { to: '/tutor/lesson-plans', icon: 'i-fluent-notepad-24', label: 'Lesson plans' },
  { to: '/tutor/earnings', icon: 'i-fluent-money-24', label: 'My earnings' },
]
