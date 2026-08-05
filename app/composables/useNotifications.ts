import type { PillTone } from '~/utils/status'

export interface AppNotification {
  id: string
  icon: string
  tone: PillTone
  title: string
  desc: string
  time: string
  unread: boolean
}

// Dummy notifications for the portal header dropdown. Portal-specific so the
// mockup reads true to each role. Kept out of components per the data seam.
export const adminNotifications: AppNotification[] = [
  {
    id: 'a1',
    icon: '📝',
    tone: 'blue',
    title: 'New enquiry',
    desc: 'Nurul Aisyah registered interest in Matematik Tingkatan 4.',
    time: '5 minutes ago',
    unread: true,
  },
  {
    id: 'a2',
    icon: '💳',
    tone: 'overdue',
    title: 'Late payment',
    desc: "Ahmad Danial's July fee is still unpaid.",
    time: '1 hour ago',
    unread: true,
  },
  {
    id: 'a3',
    icon: '✅',
    tone: 'green',
    title: 'Payment received',
    desc: 'RM 280 received from the Tan Wei Ming family.',
    time: '3 hours ago',
    unread: true,
  },
  {
    id: 'a4',
    icon: '🗓️',
    tone: 'violet',
    title: 'Class almost full',
    desc: 'Sains Tingkatan 3 (Taman Sutera) has 2 spots left.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 'a5',
    icon: '🧑‍🏫',
    tone: 'indigo',
    title: 'Schedule confirmed',
    desc: 'Cikgu Farah confirmed the teaching schedule for August.',
    time: '2 days ago',
    unread: false,
  },
]

export const tutorNotifications: AppNotification[] = [
  {
    id: 't1',
    icon: '🔔',
    tone: 'pink',
    title: 'Class reminder',
    desc: 'Matematik Tahun 5 starts in 30 minutes (Kota Warisan).',
    time: 'Just now',
    unread: true,
  },
  {
    id: 't2',
    icon: '📝',
    tone: 'amber',
    title: 'Lesson plan',
    desc: 'Lesson plan Bab 4 is due before Friday.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 't3',
    icon: '💰',
    tone: 'green',
    title: 'Payslip ready',
    desc: 'Your June payslip is ready to review.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 't4',
    icon: '👨‍👩‍👧',
    tone: 'violet',
    title: 'Message from a parent',
    desc: "Puan Noraini asked about her child's progress.",
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 't5',
    icon: '✅',
    tone: 'blue',
    title: 'Attendance recorded',
    desc: 'Saturday class attendance saved.',
    time: '2 days ago',
    unread: false,
  },
]
