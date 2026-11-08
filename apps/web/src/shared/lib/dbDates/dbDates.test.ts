import { describe, expect, it } from 'vitest'

import { fromDbDate, fromDbInstant, toDbDate } from './dbDates.ts'

describe('dbDates', () => {
  it('round-trips calendar dates without shifting', () => {
    expect(fromDbDate(toDbDate('2026-01-05'))).toBe('2026-01-05')
  })

  it('keeps moments exact', () => {
    expect(fromDbInstant(toDbDate('2026-01-05'))).toBe('2026-01-05T00:00:00Z')
  })
})
