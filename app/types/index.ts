// Domain entity types for the whole platform. Every screen is a view onto a
// Class from a different angle; a Session carries the duration that drives pay.

export type { Academy, Branch, AcademyContact } from './academy'

export type Stage = 'rendah' | 'mr' | 'ma'

/** A KPM-flavoured subject with its tile colour pairing and the stages it spans. */
export interface Subject {
  name: string
  short: string
  icon: string
  /** tile colour key, e.g. 'pink' | 'blue' ... maps to --color-tile-* / --color-fg-*. */
  tone: SubjectTone
  stage: Stage[]
  /** marketing blurb shown on the subject card. */
  desc?: string
  /** level label, e.g. "Tahun 1 to SPM". */
  level?: string
}

export type SubjectTone =
  | 'pink'
  | 'blue'
  | 'violet'
  | 'green'
  | 'amber'
  | 'orange'
  | 'indigo'
  | 'rose'

export interface Guardian {
  id: string
  name: string
  phone: string
  studentIds: string[]
}

export type EnrolStatus = 'Aktif' | 'Percubaan' | 'Tidak aktif'
export type PayStatus = 'Paid' | 'Pending' | 'Overdue'

export interface Student {
  id: string
  name: string
  first: string
  level: string
  branchId: string
  subjects: string[]
  enrol: EnrolStatus
  pay: PayStatus
  guardianId: string
  attendancePct: number
  school?: string
}

export interface Educator {
  id: string
  name: string
  first: string
  subjects: string[]
  /** human label, e.g. "Kota Warisan, Kajang". */
  branches: string
  branchIds: string[]
  rate: number
  /** recorded teaching hours this period (must equal sum of session durations). */
  hours: number
  tone: SubjectTone
}

/** Weekday keys. 'Sun' carries no classes; useGreeting needs all seven for Date.getDay(). */
export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

/** Rendered raw as an uppercase label on schedule cards. */
export type Ampm = 'AFTERNOON' | 'EVENING'

export interface Class {
  id: string
  subject: string
  cls: string
  level: string
  day: Day
  time: string
  ampm: Ampm
  branchId: string
  /** session duration in hours. */
  dur: number
  educatorId: string
  attendPct: number
  roster: string[]
}

export interface Session {
  id: string
  classId: string
  educatorId: string
  date: string
  durationHours: number
}

export interface Invoice {
  id: string
  studentId: string
  name: string
  branchId: string
  amount: number
  status: PayStatus
  proof: boolean
  period: string
}

export interface LessonPlan {
  id: string
  classId: string
  cls: string
  week: string
  topic: string
  /** KPM reference code. */
  ref: string
  material: string | null
  attached: boolean
}

export type EnquirySource = 'Facebook' | 'TikTok' | 'Google Ads'
export type EnquiryStatus = 'new' | 'pending' | 'week'

export interface Enquiry {
  id: string
  name: string
  ago: string
  detail: string
  source: EnquirySource
  status: EnquiryStatus
}

export interface PayrollRun {
  educatorId: string
  period: string
  hours: number
  rate: number
  amount: number
}

export interface Feedback {
  id: string
  studentId: string
  classId: string
  note: string
  date: string
}

export type AttendanceStatus = 'present' | 'late' | 'absent'

/** A syllabus bank row: [subject name, class count, material count]. */
export type SyllabusRow = [name: string, classes: number, materials: number]

/** A placed cell in a weekly schedule grid. */
export interface ScheduleCell {
  classId: string
  subject: string
  cls: string
  tutor: string
  branch: string
  tone: SubjectTone
}
