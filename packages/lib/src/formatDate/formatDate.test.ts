import { describe, expect, it } from 'vitest'

import { formatDate } from './formatDate.ts'

describe('formatDate', () => {
  const date = new Date(2026, 0, 5, 9, 30)

  it('formats with the default preset', () => {
    expect(formatDate(date)).toBe('5 января 2026')
  })

  it('supports presets', () => {
    expect(formatDate(date, 'short')).toBe('05.01.2026')
    expect(formatDate(date, 'dateTime')).toBe('5 января 2026, 09:30')
  })
})
