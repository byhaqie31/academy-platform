// Registration form shape + the gates that let the wizard advance.
//
// Five steps since phase 1: guardian, student, subjects, schedule, review.
// The branch step was removed when Hz went fully online.
export interface RegForm {
  parentName: string
  phone: string
  studentName: string
  level: string
  school: string
  subjects: string[]
  slots: string[]
  notes: string
  /** Unticked by default. Consent has to be a deliberate act. */
  consent: boolean
}

export function emptyRegForm(): RegForm {
  return {
    parentName: '',
    phone: '',
    studentName: '',
    level: '',
    school: '',
    subjects: [],
    slots: [],
    notes: '',
    consent: false,
  }
}

/** Malaysian mobile/landline: 10 to 11 digits beginning with 0, any separators. */
export function isValidMyPhone(s: string): boolean {
  const digits = s.replace(/\D/g, '')
  return /^0\d{9,10}$/.test(digits)
}

/** "012-345 6789" -> "012•••6789": first three and last four digits survive. */
export function maskMyPhone(s: string): string {
  const digits = s.replace(/\D/g, '')
  if (digits.length < 8) return digits
  return digits.slice(0, 3) + '•'.repeat(digits.length - 7) + digits.slice(-4)
}

/** Whether the wizard may advance from `step` given the current form. */
export function canAdvance(step: number, form: Partial<RegForm>): boolean {
  switch (step) {
    case 0:
      return !!form.parentName?.trim() && isValidMyPhone(form.phone ?? '')
    case 1:
      return !!form.studentName?.trim() && !!form.level?.trim()
    case 2:
      return (form.subjects?.length ?? 0) >= 1
    case 3:
      return (form.slots?.length ?? 0) >= 1
    default:
      return true
  }
}

/** The review step submits only once consent is given. */
export function canSubmit(form: Partial<RegForm>): boolean {
  return canAdvance(0, form) && canAdvance(1, form) && canAdvance(2, form)
    && canAdvance(3, form) && form.consent === true
}
