import { describe, it, expect } from 'vitest'
import { formatRM } from '~/utils/money'

describe('formatRM', () => {
  it('formats with RM prefix and en-MY grouping', () => {
    expect(formatRM(1710)).toBe('RM 1,710')
    expect(formatRM(40680)).toBe('RM 40,680')
    expect(formatRM(0)).toBe('RM 0')
    expect(formatRM(240)).toBe('RM 240')
  })
})
