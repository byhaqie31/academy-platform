import { describe, it, expect } from 'vitest'
import { isValidMyPhone, canAdvance, emptyRegForm } from '~/utils/validation'

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
  it('gates each step on its required fields', () => {
    const f = emptyRegForm()
    expect(canAdvance(0, f)).toBe(false)
    expect(canAdvance(0, { parentName: 'Aisyah', phone: '012-345 6789' })).toBe(true)
    expect(canAdvance(1, { studentName: 'Adam', level: 'Tahun 4' })).toBe(true)
    expect(canAdvance(1, { studentName: '', level: 'Tahun 4' })).toBe(false)
    expect(canAdvance(2, { branches: [] })).toBe(false)
    expect(canAdvance(2, { branches: ['kw'] })).toBe(true)
    expect(canAdvance(3, { subjects: [] })).toBe(false)
    expect(canAdvance(3, { subjects: ['Matematik'] })).toBe(true)
    expect(canAdvance(4, { slots: ['Petang'] })).toBe(true)
    expect(canAdvance(5, f)).toBe(true)
  })
})
