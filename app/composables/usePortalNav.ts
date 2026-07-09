export interface NavItem {
  to: string
  icon: string
  en: string
  ms: string
}

// Nav definitions mirror the prototypes exactly (admin 9, tutor 5).
export const adminNav: NavItem[] = [
  { to: '/admin', icon: '📊', en: 'Dashboard', ms: 'Papan pemuka' },
  { to: '/admin/students', icon: '🧑‍🎓', en: 'Students', ms: 'Pelajar' },
  { to: '/admin/educators', icon: '🧑‍🏫', en: 'Educators', ms: 'Pendidik' },
  { to: '/admin/schedule', icon: '🗓️', en: 'Schedule', ms: 'Jadual' },
  { to: '/admin/syllabus', icon: '📚', en: 'Syllabus', ms: 'Silibus' },
  { to: '/admin/billing', icon: '💳', en: 'Billing', ms: 'Bil & yuran' },
  { to: '/admin/payroll', icon: '💰', en: 'Payroll', ms: 'Gaji tutor' },
  { to: '/admin/branches', icon: '📍', en: 'Branches', ms: 'Cawangan' },
  { to: '/admin/settings', icon: '⚙️', en: 'Settings', ms: 'Tetapan' },
]

export const tutorNav: NavItem[] = [
  { to: '/tutor', icon: '📊', en: 'Dashboard', ms: 'Papan pemuka' },
  { to: '/tutor/schedule', icon: '🗓️', en: 'Jadual Saya', ms: 'My schedule' },
  { to: '/tutor/classes', icon: '📚', en: 'Kelas & Pelajar', ms: 'Classes' },
  { to: '/tutor/lesson-plans', icon: '📝', en: 'Rancangan', ms: 'Lesson plans' },
  { to: '/tutor/earnings', icon: '💰', en: 'Pendapatan', ms: 'My earnings' },
]
