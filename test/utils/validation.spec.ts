import { describe, it, expect } from 'vitest'
import { isValidMyPhone, maskMyPhone, canAdvance, canSubmit, emptyRegForm } from '~/utils/validation'

describe('isValidMyPhone', () => {
  it('accepts Malaysian formats and rejects junk', () => {
    expect(isValidMyPhone('012-345 6789')).toBe(true)
    expect(isValidMyPhone('0123456789')).toBe(true)
    expect(isValidMyPhone('011-3398 4412')).toBe(true)
    expect(isValidMyPhone('abc')).toBe(false)
    expect(isValidMyPhone('123')).toBe(false)
    expect(isValidMyPhone('')).toBe(false)
  })
})

describe('canAdvance', () => {
  // Five steps since phase 1: guardian, student, subjects, schedule, review.
  it('gates each step on its required fields', () => {
    const f = emptyRegForm()
    expect(canAdvance(0, f)).toBe(false)
    expect(canAdvance(0, { parentName: 'Aisyah', phone: '012-345 6789' })).toBe(true)
    expect(canAdvance(1, { studentName: 'Adam', level: 'Tahun 4' })).toBe(true)
    expect(canAdvance(1, { studentName: '', level: 'Tahun 4' })).toBe(false)
    expect(canAdvance(2, { subjects: [] })).toBe(false)
    expect(canAdvance(2, { subjects: ['Matematik'] })).toBe(true)
    expect(canAdvance(3, { slots: [] })).toBe(false)
    expect(canAdvance(3, { slots: ['Petang'] })).toBe(true)
    expect(canAdvance(4, f)).toBe(true)
  })
})

describe('emptyRegForm', () => {
  it('leaves consent unticked', () => {
    expect(emptyRegForm().consent).toBe(false)
  })
})

describe('canSubmit', () => {
  const complete = {
    parentName: 'Aisyah',
    phone: '012-345 6789',
    studentName: 'Adam',
    level: 'Tahun 4',
    subjects: ['Matematik'],
    slots: ['Petang'],
  }

  it('requires every step plus consent', () => {
    expect(canSubmit({ ...complete, consent: true })).toBe(true)
    expect(canSubmit({ ...complete, consent: false })).toBe(false)
    expect(canSubmit({ ...complete, subjects: [], consent: true })).toBe(false)
    expect(canSubmit(emptyRegForm())).toBe(false)
  })
})

describe('maskMyPhone', () => {
  it('shows the first three and last four digits', () => {
    expect(maskMyPhone('012-345 6789')).toBe('012•••6789')
    expect(maskMyPhone('0123456789')).toBe('012•••6789')
  })

  it('handles 11-digit numbers', () => {
    expect(maskMyPhone('011-2345 6789')).toBe('011••••6789')
  })
})
