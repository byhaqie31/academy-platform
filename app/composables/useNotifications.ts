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
    title: 'Enquiry baharu',
    desc: 'Nurul Aisyah daftar minat untuk Matematik Tingkatan 4.',
    time: '5 minit lalu',
    unread: true,
  },
  {
    id: 'a2',
    icon: '💳',
    tone: 'overdue',
    title: 'Bayaran lewat',
    desc: 'Yuran Julai Ahmad Danial masih belum dijelaskan.',
    time: '1 jam lalu',
    unread: true,
  },
  {
    id: 'a3',
    icon: '✅',
    tone: 'green',
    title: 'Bayaran diterima',
    desc: 'RM 280 diterima dari keluarga Tan Wei Ming.',
    time: '3 jam lalu',
    unread: true,
  },
  {
    id: 'a4',
    icon: '🗓️',
    tone: 'violet',
    title: 'Kelas hampir penuh',
    desc: 'Sains Tingkatan 3 (Taman Sutera) tinggal 2 tempat.',
    time: 'Semalam',
    unread: false,
  },
  {
    id: 'a5',
    icon: '🧑‍🏫',
    tone: 'indigo',
    title: 'Jadual disahkan',
    desc: 'Cikgu Farah sahkan jadual mengajar untuk Ogos.',
    time: '2 hari lalu',
    unread: false,
  },
]

export const tutorNotifications: AppNotification[] = [
  {
    id: 't1',
    icon: '🔔',
    tone: 'pink',
    title: 'Peringatan kelas',
    desc: 'Matematik Tahun 5 bermula dalam 30 minit (Kota Warisan).',
    time: 'Baru sahaja',
    unread: true,
  },
  {
    id: 't2',
    icon: '📝',
    tone: 'amber',
    title: 'Rancangan mengajar',
    desc: 'Lesson plan Bab 4 perlu dihantar sebelum Jumaat.',
    time: '2 jam lalu',
    unread: true,
  },
  {
    id: 't3',
    icon: '💰',
    tone: 'green',
    title: 'Slip gaji sedia',
    desc: 'Slip gaji Jun anda sudah tersedia untuk disemak.',
    time: 'Semalam',
    unread: false,
  },
  {
    id: 't4',
    icon: '👨‍👩‍👧',
    tone: 'violet',
    title: 'Mesej ibu bapa',
    desc: 'Puan Noraini bertanya tentang kemajuan anaknya.',
    time: 'Semalam',
    unread: false,
  },
  {
    id: 't5',
    icon: '✅',
    tone: 'blue',
    title: 'Kehadiran direkod',
    desc: 'Kehadiran kelas Sabtu berjaya disimpan.',
    time: '2 hari lalu',
    unread: false,
  },
]
