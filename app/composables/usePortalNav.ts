export interface NavItem {
  to: string
  icon: string
  label: string
}

export const adminNav: NavItem[] = [
  { to: '/admin', icon: '📊', label: 'Dashboard' },
  { to: '/admin/students', icon: '🧑‍🎓', label: 'Students' },
  { to: '/admin/educators', icon: '🧑‍🏫', label: 'Educators' },
  { to: '/admin/schedule', icon: '🗓️', label: 'Schedule' },
  { to: '/admin/syllabus', icon: '📚', label: 'Syllabus' },
  { to: '/admin/billing', icon: '💳', label: 'Billing' },
  { to: '/admin/payroll', icon: '💰', label: 'Payroll' },
  { to: '/admin/branches', icon: '📍', label: 'Branches' },
  { to: '/admin/settings', icon: '⚙️', label: 'Settings' },
]

export const tutorNav: NavItem[] = [
  { to: '/tutor', icon: '📊', label: 'Dashboard' },
  { to: '/tutor/schedule', icon: '🗓️', label: 'My schedule' },
  { to: '/tutor/classes', icon: '📚', label: 'Classes and students' },
  { to: '/tutor/lesson-plans', icon: '📝', label: 'Lesson plans' },
  { to: '/tutor/earnings', icon: '💰', label: 'My earnings' },
]
