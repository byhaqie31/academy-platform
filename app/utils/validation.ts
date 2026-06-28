// Registration form shape + the gates that let the wizard advance.
export interface RegForm {
  parentName: string
  phone: string
  studentName: string
  level: string
  school: string
  branches: string[]
  subjects: string[]
  slots: string[]
  notes: string
}

export function emptyRegForm(): RegForm {
  return {
    parentName: '',
    phone: '',
    studentName: '',
    level: '',
    school: '',
    branches: [],
    subjects: [],
    slots: [],
    notes: '',
  }
}

/** Malaysian mobile/landline: 10 to 11 digits beginning with 0, any separators. */
export function isValidMyPhone(s: string): boolean {
  const digits = s.replace(/\D/g, '')
  return /^0\d{9,10}$/.test(digits)
}

/** Whether the wizard may advance from `step` given the current form. */
export function canAdvance(step: number, form: Partial<RegForm>): boolean {
  switch (step) {
    case 0:
      return !!form.parentName?.trim() && isValidMyPhone(form.phone ?? '')
    case 1:
      return !!form.studentName?.trim() && !!form.level?.trim()
    case 2:
      return (form.branches?.length ?? 0) >= 1
    case 3:
      return (form.subjects?.length ?? 0) >= 1
    case 4:
      return (form.slots?.length ?? 0) >= 1
    default:
      return true
  }
}
