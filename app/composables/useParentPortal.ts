import { computed } from 'vue'
import { useStudents } from '~/composables/useStudents'
import { useGuardians } from '~/composables/useGuardians'
import { useClasses } from '~/composables/useClasses'
import { useSubjects } from '~/composables/useSubjects'
import { useBilling } from '~/composables/useBilling'
import { useAcademy } from '~/composables/useAcademy'
import { useEntitlement, type Verdict } from '~/composables/useEntitlement'
import { usePortalDemo } from '~/composables/usePortalDemo'
import type { Class, Student, SubjectTone } from '~/types'

export interface ParentClassRow {
  cls: Class
  subject: string
  tone: SubjectTone
  tutor: string
  branch: string
  today: boolean
  verdict: Verdict
  /** live means the join button is pressable right now */
  live: boolean
}

export interface FeeLine {
  subject: string
  tone: SubjectTone
  amount: number
  paid: boolean
  enrolled: boolean
}

/**
 * Everything one guardian sees, assembled from the same seam every other
 * screen uses. The parent portal never reaches past this into the store.
 */
// swap internals for API calls when backend lands; signature stays stable
export function useParentPortal(studentId = 's0') {
  const students = useStudents()
  const guardians = useGuardians()
  const classes = useClasses()
  const subjects = useSubjects()
  const billing = useBilling()
  const { branchShort } = useAcademy()
  const gate = useEntitlement()
  const demo = usePortalDemo()

  const child = students.byId(studentId) as Student
  const guardian = guardians.forStudent(studentId)

  /**
   * The class a child actually sits in for a subject.
   *
   * Roster first, because that is the fact. Then level, because putting a
   * Tahun 4 student in a Tingkatan 2 class is worse than putting them in the
   * wrong branch. Then branch, then whatever exists.
   */
  function classFor(subject: string): Class | undefined {
    const pool = classes.all.filter((c) => c.subject === subject)
    return (
      pool.find((c) => c.roster.includes(child.name))
      ?? pool.find((c) => c.level === child.level)
      ?? pool.find((c) => c.branchId === child.branchId)
      ?? pool[0]
    )
  }

  const rows = computed<ParentClassRow[]>(() =>
    child.subjects
      .map((subject) => {
        const cls = classFor(subject)
        if (!cls) return null
        const today = cls.day === demo.today
        const verdict = gate.check(subject)
        return {
          cls,
          subject,
          tone: subjects.toneOf(subject) as SubjectTone,
          tutor: subjects.tutorFor(subject),
          branch: branchShort(cls.branchId),
          today,
          verdict,
          live: today && verdict.allowed,
        }
      })
      .filter((r): r is ParentClassRow => r !== null)
      .sort((a, b) => Number(b.today) - Number(a.today) || a.cls.time.localeCompare(b.cls.time)),
  )

  const todayRows = computed(() =>
    rows.value.filter((r) => r.today).sort((a, b) => a.cls.time.localeCompare(b.cls.time)),
  )

  const invoiceTotal = computed(
    () => billing.all.find((i) => i.studentId === studentId)?.amount ?? 0,
  )

  /** the invoice split per subject, which is what the gate actually reads */
  const lines = computed<FeeLine[]>(() => {
    const each = Math.round(invoiceTotal.value / Math.max(child.subjects.length, 1))
    return child.subjects.map((subject) => ({
      subject,
      tone: subjects.toneOf(subject) as SubjectTone,
      amount: each,
      paid: gate.paidFor(subject),
      enrolled: true,
    }))
  })

  const outstanding = computed(() =>
    lines.value.filter((l) => !l.paid).reduce((n, l) => n + l.amount, 0),
  )

  /** one subject the child could add, priced the same, for the upsell row */
  const available = computed<FeeLine[]>(() => {
    const each = Math.round(invoiceTotal.value / Math.max(child.subjects.length, 1))
    return subjects.all
      .filter((s) => !child.subjects.includes(s.name))
      .filter((s) => s.stage.includes('rendah'))
      .slice(0, 1)
      .map((s) => ({
        subject: s.name,
        tone: s.tone,
        amount: each,
        paid: false,
        enrolled: false,
      }))
  })

  const period = 'Ogos 2026'
  const dueLabel = '7 Ogos 2026'
  const paidLabel = '2 Ogos 2026'

  /** eight sessions a month; attended is derived from the seeded percentage */
  const attendance = computed(() => {
    const total = 8
    const attended = Math.round((child.attendancePct / 100) * total)
    return {
      total,
      attended,
      note: `${child.first} tidak pernah terlepas kelas ${child.subjects[0]} bulan ini.`,
    }
  })

  return {
    child,
    guardian,
    guardianFirst: computed(() => (guardian?.name ?? '').replace(/^(Puan|Encik|Cik|Tuan)\s+/, '')),
    rows,
    todayRows,
    lines,
    available,
    invoiceTotal,
    outstanding,
    attendance,
    period,
    dueLabel,
    paidLabel,
    todayLabel: demo.todayLabel,
    cycle: demo.cycle,
    step: computed(() => demo.stepFor(demo.cycle.value)),
    /** days remaining before the gate, for the countdown */
    daysLeft: computed(() => {
      const c = demo.cycle.value
      if (c === 'due') return 3
      if (c === 'final' || c === 'partial') return 0
      return -1
    }),
  }
}
