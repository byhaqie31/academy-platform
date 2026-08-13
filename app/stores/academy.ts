import { defineStore } from 'pinia'
import { academy } from '~~/config/academy'
import { siteContent } from './siteContent'
import { demoIndex } from './demoIndex'
import type {
  Ampm,
  AttendanceStatus,
  Class,
  Educator,
  Enquiry,
  Feedback,
  Guardian,
  Invoice,
  LessonPlan,
  NewStudent,
  Session,
  Stage,
  Student,
  Subject,
  SubjectTone,
  SyllabusRow,
} from '~/types'

// ------------------------------------------------------------------ //
// The single seeded store. Realistic, internally consistent Malaysian
// tuition-centre data. Components never read this directly; the
// composables in app/composables/ are the only access layer.
// ------------------------------------------------------------------ //

const WEEK_STARTS = ['2026-06-02', '2026-06-09', '2026-06-16', '2026-06-23'] as const
export const WEEK_LABELS = [
  'Week 1 · 2–8 June',
  'Week 2 · 9–15 June',
  'Week 3 · 16–22 June',
  'Week 4 · 23–29 June',
]

const subjects: Subject[] = [
  { name: 'Matematik', short: 'Mat', icon: '📐', fluentIcon: 'i-fluent-calculator-24-regular', tone: 'pink', stage: ['rendah', 'mr', 'ma'], desc: 'Solid number sense & quick answering techniques.', level: 'Tahun 1 to SPM' },
  { name: 'Bahasa Melayu', short: 'BM', icon: '📖', fluentIcon: 'i-fluent-book-open-24-regular', tone: 'green', stage: ['rendah', 'mr', 'ma'], desc: 'Essays, grammar & excellent comprehension.', level: 'Tahun 1 to SPM' },
  { name: 'Bahasa Inggeris', short: 'BI', icon: '🔤', fluentIcon: 'i-fluent-translate-24-regular', tone: 'blue', stage: ['rendah', 'mr', 'ma'], desc: 'Speaking, writing & confidence in English.', level: 'Tahun 1 to SPM' },
  { name: 'Sains', short: 'Sn', icon: '🔬', fluentIcon: 'i-fluent-beaker-24-regular', tone: 'violet', stage: ['rendah', 'mr', 'ma'], desc: 'Fun experiments & facts that stick.', level: 'Tahun 1 to SPM' },
  { name: 'Sejarah', short: 'Sej', icon: '📜', fluentIcon: 'i-fluent-history-24-regular', tone: 'amber', stage: ['mr', 'ma'], desc: 'Memory techniques & neat, structured notes.', level: 'Menengah' },
  { name: 'Geografi', short: 'Geo', icon: '🌏', fluentIcon: 'i-fluent-globe-24-regular', tone: 'orange', stage: ['mr'], desc: 'Maps, climate & practical geography skills.', level: 'Menengah' },
  { name: 'Pendidikan Islam', short: 'PI', icon: '🕌', fluentIcon: 'i-fluent-building-mosque-24-regular', tone: 'green', stage: ['rendah'], desc: 'Jawi, tajwid & akhlak, taught with patience.', level: 'Tahun 1 to SPM' },
  { name: 'STEM', short: 'STEM', icon: '🤖', fluentIcon: 'i-fluent-bot-24-regular', tone: 'indigo', stage: ['rendah', 'mr'], desc: 'Robotics, coding & fun applied science.', level: 'Sekolah Rendah' },
  { name: 'TVET', short: 'TVET', icon: '🎨', fluentIcon: 'i-fluent-paint-brush-24-regular', tone: 'rose', stage: ['ma'], desc: 'Practical technical & vocational skills.', level: 'Menengah Atas' },
]

// The marketing landing grid mixes subjects with programme tiles, kept verbatim.
export interface MarketingSubject {
  icon: string
  name: string
  desc: string
  level: string
  tone: SubjectTone
}
const marketingSubjects: MarketingSubject[] = [
  { icon: '📐', name: 'Matematik', desc: 'Solid number sense & quick answering techniques.', level: 'Tahun 1 to SPM', tone: 'pink' },
  { icon: '📖', name: 'Bahasa Melayu', desc: 'Essays, grammar & excellent comprehension.', level: 'Tahun 1 to SPM', tone: 'green' },
  { icon: '🔤', name: 'Bahasa Inggeris', desc: 'Speaking, writing & confidence in English.', level: 'Tahun 1 to SPM', tone: 'blue' },
  { icon: '🔬', name: 'Sains', desc: 'Fun experiments & facts that stick.', level: 'Tahun 1 to SPM', tone: 'violet' },
  { icon: '📜', name: 'Sejarah', desc: 'Memory techniques & neat, structured notes.', level: 'Menengah', tone: 'amber' },
  { icon: '🕌', name: 'Pendidikan Islam', desc: 'Jawi, tajwid & akhlak, taught with patience.', level: 'Tahun 1 to SPM', tone: 'green' },
  { icon: '🎒', name: 'Sekolah Rendah', desc: 'Tahun 1 to 6, strong foundations & early study habits.', level: 'UPSR ready', tone: 'blue' },
  { icon: '✏️', name: 'Menengah Rendah', desc: 'Tingkatan 1 to 3, solid PT3 preparation.', level: 'PT3', tone: 'pink' },
  { icon: '🎓', name: 'SPM Preparation', desc: 'Tingkatan 4 to 5, focused on A scores & exam technique.', level: 'SPM', tone: 'violet' },
]

const guardians: Guardian[] = [
  { id: 'g0', name: 'Puan Aisyah', phone: '012-345 6789', studentIds: ['s0'] },
  { id: 'g1', name: 'Encik Rizal', phone: '013-228 7741', studentIds: ['s1'] },
  { id: 'g2', name: 'Puan Mei Ling', phone: '016-552 9080', studentIds: ['s2'] },
  { id: 'g3', name: 'Encik Suresh', phone: '011-3398 4412', studentIds: ['s3'] },
  { id: 'g4', name: 'Puan Farah', phone: '019-664 2231', studentIds: ['s4'] },
  { id: 'g5', name: 'Encik Hafiz Z.', phone: '017-228 1190', studentIds: ['s5'] },
  { id: 'g6', name: 'Puan Tan', phone: '012-887 5521', studentIds: ['s6'] },
  { id: 'g7', name: 'Puan Liza', phone: '014-220 7788', studentIds: ['s7'] },
]

const students: Student[] = [
  { id: 's0', name: 'Adam Haziq', first: 'Adam', level: 'Tahun 4', branchId: 'kw', subjects: ['Matematik', 'Sains', 'Bahasa Inggeris'], enrol: 'Active', pay: 'Paid', guardianId: 'g0', attendancePct: 92, school: 'SK Kota Warisan' },
  { id: 's1', name: 'Nur Iman', first: 'Iman', level: 'Tingkatan 2', branchId: 'sk', subjects: ['Bahasa Melayu', 'Bahasa Inggeris'], enrol: 'Active', pay: 'Pending', guardianId: 'g1', attendancePct: 88, school: 'SMK Kajang' },
  { id: 's2', name: 'Wong Jia Xin', first: 'Jia Xin', level: 'Tahun 6', branchId: 'ix', subjects: ['Matematik', 'Sains'], enrol: 'Active', pay: 'Paid', guardianId: 'g2', attendancePct: 95, school: 'SJKC Taman Ixora' },
  { id: 's3', name: 'Diya Suresh', first: 'Diya', level: 'Tingkatan 5', branchId: 'pk', subjects: ['Matematik', 'Sains', 'Sejarah'], enrol: 'Active', pay: 'Overdue', guardianId: 'g3', attendancePct: 78, school: 'SMK Pekan' },
  { id: 's4', name: 'Aiman Farah', first: 'Aiman', level: 'Tingkatan 1', branchId: 'kw', subjects: ['Sains', 'Sejarah', 'Geografi'], enrol: 'Trial', pay: 'Pending', guardianId: 'g4', attendancePct: 84, school: 'SMK Kota Warisan' },
  { id: 's5', name: 'Sofea Hafiz', first: 'Sofea', level: 'Tahun 3', branchId: 'sk', subjects: ['Matematik', 'Bahasa Inggeris'], enrol: 'Active', pay: 'Paid', guardianId: 'g5', attendancePct: 93, school: 'SK Kajang' },
  { id: 's6', name: 'Tan Wei Jie', first: 'Wei Jie', level: 'Tingkatan 4', branchId: 'ix', subjects: ['Matematik', 'STEM'], enrol: 'Active', pay: 'Paid', guardianId: 'g6', attendancePct: 96, school: 'SMK Taman Ixora' },
  { id: 's7', name: 'Hariz Danial', first: 'Hariz', level: 'Tahun 5', branchId: 'pk', subjects: ['Bahasa Melayu', 'Geografi'], enrol: 'Inactive', pay: 'Pending', guardianId: 'g7', attendancePct: 71, school: 'SK Pekan' },
]

const educators: Educator[] = [
  { id: 'hafiz', name: 'Cikgu Hafiz', first: 'Hafiz', subjects: ['Matematik'], branches: 'Kota Warisan, Kajang', branchIds: ['kw', 'sk'], rate: 45, hours: 38, tone: 'pink' },
  { id: 'meiling', name: 'Cikgu Mei Ling', first: 'Mei Ling', subjects: ['Sains'], branches: 'Kajang, Taman Ixora', branchIds: ['sk', 'ix'], rate: 50, hours: 32, tone: 'blue' },
  { id: 'suresh', name: 'Cikgu Suresh', first: 'Suresh', subjects: ['Bahasa Inggeris', 'Geografi'], branches: 'Taman Ixora', branchIds: ['ix'], rate: 42, hours: 28, tone: 'violet' },
  { id: 'aishah', name: 'Cikgu Aishah', first: 'Aishah', subjects: ['Bahasa Melayu', 'Sejarah'], branches: 'Pekan', branchIds: ['pk'], rate: 40, hours: 30, tone: 'green' },
  { id: 'faridah', name: 'Cikgu Faridah', first: 'Faridah', subjects: ['Matematik', 'Sains'], branches: 'Kota Warisan', branchIds: ['kw'], rate: 48, hours: 24, tone: 'amber' },
  { id: 'daniel', name: 'Cikgu Daniel', first: 'Daniel', subjects: ['STEM', 'TVET'], branches: 'Taman Ixora, Kajang', branchIds: ['ix', 'sk'], rate: 55, hours: 18, tone: 'orange' },
]

// Hafiz's four classes (the tutor persona). Rosters drive attendance.
const hafizClasses: Class[] = [
  { id: 'c0', subject: 'Matematik', cls: 'Tahun 4 Bestari', level: 'Tahun 4', day: 'Mon', time: '3:00 PM', ampm: 'AFTERNOON', branchId: 'kw', dur: 1.5, educatorId: 'hafiz', attendPct: 94, roster: ['Adam Haziq', 'Sofea Hafiz', 'Aiman Farah', 'Lim Kai Xin', 'Nurin Sofia', 'Daniel Tan'] },
  { id: 'c1', subject: 'Matematik', cls: 'Tingkatan 3 Cerdik', level: 'Tingkatan 3', day: 'Mon', time: '5:00 PM', ampm: 'AFTERNOON', branchId: 'kw', dur: 1.5, educatorId: 'hafiz', attendPct: 89, roster: ['Iqbal Danish', 'Hana Zara', 'Arif Haikal', 'Mei Yi', 'Tasha Lina', 'Zarif Aiman'] },
  { id: 'c2', subject: 'Matematik', cls: 'Tahun 1 Jujur', level: 'Tahun 1', day: 'Thu', time: '4:30 PM', ampm: 'AFTERNOON', branchId: 'kw', dur: 1.5, educatorId: 'hafiz', attendPct: 96, roster: ['Qaseh Nadia', 'Luqman Hakim', 'Elya Sofea', 'Danish Iman', 'Yusuf Adam'] },
  { id: 'c3', subject: 'Matematik', cls: 'Tingkatan 5 Gigih', level: 'Tingkatan 5', day: 'Tue', time: '7:30 PM', ampm: 'EVENING', branchId: 'sk', dur: 2, educatorId: 'hafiz', attendPct: 91, roster: ['Diya Suresh', 'Wong Jia Xin', 'Faris Adam', 'Nadia Rahim', 'Kavin Raj', 'Lee Wen Hao', 'Sara Iman'] },
]

// Other educators' classes, placed to reproduce the admin weekly grid.
const otherClasses: Class[] = [
  { id: 'cc0', subject: 'Sains', cls: 'Tingkatan 2 Amanah', level: 'Tingkatan 2', day: 'Wed', time: '3:00 PM', ampm: 'AFTERNOON', branchId: 'sk', dur: 1.5, educatorId: 'meiling', attendPct: 90, roster: [] },
  { id: 'cc1', subject: 'Bahasa Inggeris', cls: 'Tahun 6 Cemerlang', level: 'Tahun 6', day: 'Sat', time: '3:00 PM', ampm: 'AFTERNOON', branchId: 'ix', dur: 1.5, educatorId: 'suresh', attendPct: 87, roster: [] },
  { id: 'cc2', subject: 'Bahasa Melayu', cls: 'Tingkatan 3 Murni', level: 'Tingkatan 3', day: 'Tue', time: '4:30 PM', ampm: 'AFTERNOON', branchId: 'pk', dur: 1.5, educatorId: 'aishah', attendPct: 92, roster: [] },
  { id: 'cc3', subject: 'Sains', cls: 'Tahun 4 Amanah', level: 'Tahun 4', day: 'Sat', time: '4:30 PM', ampm: 'AFTERNOON', branchId: 'ix', dur: 1.5, educatorId: 'meiling', attendPct: 88, roster: [] },
  { id: 'cc4', subject: 'Sejarah', cls: 'Tingkatan 4 Wira', level: 'Tingkatan 4', day: 'Mon', time: '6:00 PM', ampm: 'EVENING', branchId: 'pk', dur: 1.5, educatorId: 'aishah', attendPct: 85, roster: [] },
  { id: 'cc5', subject: 'Geografi', cls: 'Tingkatan 2 Setia', level: 'Tingkatan 2', day: 'Wed', time: '6:00 PM', ampm: 'EVENING', branchId: 'ix', dur: 1.5, educatorId: 'suresh', attendPct: 83, roster: [] },
  { id: 'cc6', subject: 'Bahasa Inggeris', cls: 'SPM Intensif', level: 'Tingkatan 5', day: 'Thu', time: '7:30 PM', ampm: 'EVENING', branchId: 'ix', dur: 2, educatorId: 'suresh', attendPct: 89, roster: [] },
  { id: 'cc7', subject: 'Sains', cls: 'Tingkatan 5 Cerdas', level: 'Tingkatan 5', day: 'Fri', time: '7:30 PM', ampm: 'EVENING', branchId: 'sk', dur: 2, educatorId: 'meiling', attendPct: 90, roster: [] },
]

const classes: Class[] = [...hafizClasses, ...otherClasses]

// ---- Sessions: the spine for payroll. Sum per educator == educator.hours. ----
// Hafiz: a class x week matrix. Row sums (by class) = [9,9,8,12]; column sums
// (by week) = [9.5,9.5,9,10]; total = 38. Reconciles every earnings breakdown.
const HAFIZ_MATRIX: Record<string, number[]> = {
  c0: [2.5, 2.5, 2, 2], // = 9
  c1: [2.5, 2.5, 2, 2], // = 9
  c2: [2, 2, 2, 2], //     = 8
  c3: [2.5, 2.5, 3, 4], // = 12
}
// Other educators: four equal weekly sessions summing to their recorded hours.
const OTHER_WEEKLY: Record<string, { classId: string; weekly: number[] }> = {
  meiling: { classId: 'cc0', weekly: [8, 8, 8, 8] }, //     = 32
  suresh: { classId: 'cc1', weekly: [7, 7, 7, 7] }, //      = 28
  aishah: { classId: 'cc2', weekly: [7.5, 7.5, 7.5, 7.5] }, // = 30
  faridah: { classId: 'cc0', weekly: [6, 6, 6, 6] }, //     = 24
  daniel: { classId: 'cc1', weekly: [4.5, 4.5, 4.5, 4.5] }, // = 18
}

function buildSessions(): Session[] {
  const out: Session[] = []
  let n = 0
  for (const [classId, weekly] of Object.entries(HAFIZ_MATRIX)) {
    weekly.forEach((dur, w) => {
      out.push({ id: `ses${n++}`, classId, educatorId: 'hafiz', date: WEEK_STARTS[w]!, durationHours: dur })
    })
  }
  for (const [educatorId, { classId, weekly }] of Object.entries(OTHER_WEEKLY)) {
    weekly.forEach((dur, w) => {
      out.push({ id: `ses${n++}`, classId, educatorId, date: WEEK_STARTS[w]!, durationHours: dur })
    })
  }
  return out
}
const sessions: Session[] = buildSessions()

const invoices: Invoice[] = [
  { id: 'inv0', studentId: 's0', name: 'Adam Haziq', branchId: 'kw', amount: 240, status: 'Paid', proof: true, period: 'Jun 2026' },
  { id: 'inv1', studentId: 's2', name: 'Wong Jia Xin', branchId: 'ix', amount: 240, status: 'Paid', proof: true, period: 'Jun 2026' },
  { id: 'inv2', studentId: 's5', name: 'Sofea Hafiz', branchId: 'sk', amount: 180, status: 'Paid', proof: true, period: 'Jun 2026' },
  { id: 'inv3', studentId: 's6', name: 'Tan Wei Jie', branchId: 'ix', amount: 260, status: 'Paid', proof: true, period: 'Jun 2026' },
  { id: 'inv4', studentId: 's1', name: 'Nur Iman', branchId: 'sk', amount: 180, status: 'Pending', proof: false, period: 'Jun 2026' },
  { id: 'inv5', studentId: 's4', name: 'Aiman Farah', branchId: 'kw', amount: 180, status: 'Pending', proof: false, period: 'Jun 2026' },
  { id: 'inv6', studentId: 's7', name: 'Hariz Danial', branchId: 'pk', amount: 180, status: 'Pending', proof: false, period: 'Jun 2026' },
  { id: 'inv7', studentId: 's3', name: 'Diya Suresh', branchId: 'pk', amount: 300, status: 'Overdue', proof: false, period: 'Jun 2026' },
]

const lessonPlans: LessonPlan[] = [
  { id: 'lp0', classId: 'c0', cls: 'Tahun 4 Bestari', week: 'Week 26', topic: 'Pecahan & perpuluhan', ref: 'KSSR Thn 4 · 4.2', material: 'Nota_Pecahan.pdf', attached: true },
  { id: 'lp1', classId: 'c1', cls: 'Tingkatan 3 Cerdik', week: 'Week 26', topic: 'Indeks & hukum kuasa', ref: 'KSSM Tkt 3 · 1.3', material: 'Latihan_Indeks.pdf', attached: true },
  { id: 'lp2', classId: 'c2', cls: 'Tahun 1 Jujur', week: 'Week 26', topic: 'Nombor hingga 100', ref: 'KSSR Thn 1 · 1.1', material: null, attached: false },
  { id: 'lp3', classId: 'c3', cls: 'Tingkatan 5 Gigih', week: 'Week 26', topic: 'Janjang aritmetik', ref: 'KSSM Tkt 5 · 5.1', material: null, attached: false },
  { id: 'lp4', classId: 'cc0', cls: 'Tingkatan 2 Amanah', week: 'Week 26', topic: 'Sistem suria', ref: 'KSSM Tkt 2 · 9.1', material: 'Slaid_SistemSuria.pdf', attached: true },
  { id: 'lp5', classId: 'cc4', cls: 'Tingkatan 4 Wira', week: 'Week 26', topic: 'Kesultanan Melayu Melaka', ref: 'KSSM Tkt 4 · Bab 5', material: 'Peta_Minda_Melaka.pdf', attached: true },
]

const enquiries: Enquiry[] = [
  { id: 'enq0', name: 'Puan Aisyah', ago: '12 min ago', detail: 'Adam · Matematik, Sains · Tahun 4', source: 'Facebook', status: 'new' },
  { id: 'enq1', name: 'Encik Rizal', ago: '1 hour ago', detail: 'Nur Iman · BM, BI · Tingkatan 2', source: 'TikTok', status: 'new' },
  { id: 'enq2', name: 'Puan Mei Ling', ago: '2 hours ago', detail: 'Wong Jia · Matematik · Tahun 6', source: 'Facebook', status: 'pending' },
  { id: 'enq3', name: 'Encik Suresh', ago: '3 hours ago', detail: 'Diya · SPM Prep · Tingkatan 5', source: 'Google Ads', status: 'week' },
]

const feedback: Feedback[] = [
  { id: 'fb0', studentId: 's0', classId: 'c0', note: 'Adam shows strong progress in fractions.', date: '24 Jun 2026' },
  { id: 'fb1', studentId: 's3', classId: 'c3', note: 'Diya needs more practice with sequences before SPM.', date: '23 Jun 2026' },
]

// The dashboard "today" agenda (curated cross-tutor snapshot).
export interface AgendaRow {
  time: string
  ampm: Ampm
  subject: string
  cls: string
  educatorId: string
  branchId: string
}
// Two evening slots: the centre is online, so nobody is taught at 3pm while
// they are still in school.
const agenda: AgendaRow[] = [
  { time: '7:30', ampm: 'EVENING', subject: 'Matematik', cls: 'Tahun 4 Bestari', educatorId: 'hafiz', branchId: 'kw' },
  { time: '7:30', ampm: 'EVENING', subject: 'Sains', cls: 'Tingkatan 2 Amanah', educatorId: 'meiling', branchId: 'sk' },
  { time: '7:30', ampm: 'EVENING', subject: 'Bahasa Inggeris', cls: 'Tahun 6 Cemerlang', educatorId: 'suresh', branchId: 'ix' },
  { time: '9:00', ampm: 'EVENING', subject: 'Sejarah', cls: 'Tingkatan 4 Wira', educatorId: 'aishah', branchId: 'pk' },
  { time: '9:00', ampm: 'EVENING', subject: 'Matematik', cls: 'Tingkatan 5 Gigih', educatorId: 'hafiz', branchId: 'kw' },
]

// Syllabus bank: stage -> [subject, classes, materials].
const syllabusBank: Record<Stage, SyllabusRow[]> = {
  rendah: [['Bahasa Melayu', 6, 12], ['Bahasa Inggeris', 6, 10], ['Matematik', 6, 14], ['Sains', 5, 9], ['Pendidikan Islam', 4, 7], ['STEM', 3, 5]],
  mr: [['Bahasa Melayu', 5, 11], ['Bahasa Inggeris', 5, 9], ['Matematik', 6, 13], ['Sains', 5, 10], ['Sejarah', 4, 8], ['Geografi', 3, 6]],
  ma: [['Bahasa Melayu', 4, 9], ['Bahasa Inggeris', 4, 8], ['Matematik', 5, 12], ['Sains', 4, 9], ['Sejarah', 4, 8], ['TVET', 2, 4]],
}

// Which tutor + slot teaches a subject (for the student detail view).
const subjectTutor: Record<string, string> = { Matematik: 'Cikgu Hafiz', Sains: 'Cikgu Mei Ling', 'Bahasa Inggeris': 'Cikgu Suresh', 'Bahasa Melayu': 'Cikgu Aishah', Sejarah: 'Cikgu Aishah', Geografi: 'Cikgu Suresh', STEM: 'Cikgu Daniel', TVET: 'Cikgu Daniel', 'Pendidikan Islam': 'Cikgu Aishah' }
const subjectSchedule: Record<string, string> = { Matematik: 'Mon · 3:00 PM', Sains: 'Wed · 5:00 PM', 'Bahasa Inggeris': 'Sat · 10:00 AM', 'Bahasa Melayu': 'Tue · 4:30 PM', Sejarah: 'Thu · 6:00 PM', Geografi: 'Fri · 5:00 PM', STEM: 'Sat · 2:00 PM', TVET: 'Sun · 2:00 PM', 'Pendidikan Islam': 'Sun · 10:00 AM' }

// Centre-wide headline metrics. Larger than the detailed seed slice on
// purpose: the demo shows full scale while the slice stays inspectable.
const metrics = {
  newEnquiries: 18,
  activeStudents: 342,
  classesToday: 9,
  outstanding: 2160,
  outstandingCount: 9,
  revenue: 82080,
  cost: 41400,
  margin: 40680,
  marginPct: 49.6,
  payrollTotal: 41400,
  totalHours: 170,
  branchesActive: 4,
  classesActive: 27,
  adminAccounts: 3,
  defaultFee: 240,
}

export const useAcademyStore = defineStore('academy', {
  state: () => ({
    academy,
    subjects,
    marketingSubjects,
    guardians,
    students,
    educators,
    classes,
    sessions,
    invoices,
    lessonPlans,
    enquiries,
    feedback,
    agenda,
    syllabusBank,
    subjectTutor,
    subjectSchedule,
    metrics,
    // Public marketing website copy, seeded in siteContent.ts. Still one store.
    ...siteContent,
    // The internal /demo directory. Not linked from the public site.
    ...demoIndex,
    weekStarts: [...WEEK_STARTS],
    weekLabels: [...WEEK_LABELS],
    /** id of the tutor whose portal we render (Cikgu Hafiz). */
    tutorSelfId: 'hafiz',
    /** Live attendance edits, keyed `classId|studentName`. Default present. */
    attendance: {} as Record<string, AttendanceStatus>,
    /**
     * Walkthrough edits, layered over the seed rather than written into it.
     * An overlay keeps the seed pristine, so resetting is dropping the layer.
     * Nothing here survives a refresh.
     */
    demo: {
      paidInvoiceIds: [] as string[],
      chasedGuardianIds: [] as string[],
      registeredStudents: [] as Student[],
    },
  }),
  getters: {
    branches: (s) => s.academy.branches,
  },
  actions: {
    setAttendance(key: string, status: AttendanceStatus) {
      this.attendance[key] = status
    },
    resetAttendance() {
      this.attendance = {}
    },
    recordPayment(invoiceId: string) {
      if (!this.demo.paidInvoiceIds.includes(invoiceId)) {
        this.demo.paidInvoiceIds.push(invoiceId)
      }
    },
    chase(guardianIds: string[]) {
      for (const id of guardianIds) {
        if (!this.demo.chasedGuardianIds.includes(id)) {
          this.demo.chasedGuardianIds.push(id)
        }
      }
    },
    registerStudent(input: NewStudent) {
      const seq = this.demo.registeredStudents.length
      this.demo.registeredStudents.push({
        id: `demo-s${seq}`,
        name: input.name,
        first: input.name.split(' ')[0] ?? input.name,
        level: input.level,
        branchId: this.academy.branches[0]?.id ?? '',
        subjects: input.subjects,
        enrol: 'Trial',
        pay: 'Pending',
        guardianId: this.guardians[0]?.id ?? '',
        attendancePct: 100,
      })
    },
    resetDemo() {
      this.demo.paidInvoiceIds = []
      this.demo.chasedGuardianIds = []
      this.demo.registeredStudents = []
      this.resetAttendance()
    },
  },
})
