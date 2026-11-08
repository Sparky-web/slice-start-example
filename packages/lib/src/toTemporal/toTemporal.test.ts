import { describe, expect, it } from 'vitest'

import { toTemporal } from './toTemporal.ts'

describe('toTemporal', () => {
  it('keeps calendar dates as plain dates', () => {
    expect(toTemporal('2026-01-05')).toBeInstanceOf(Temporal.PlainDate)
  })

  it('parses moments with an offset as instants', () => {
    expect(toTemporal('2026-01-05T09:30:00.000Z')).toBeInstanceOf(Temporal.Instant)
  })

  it('passes Temporal values through', () => {
    const date = Temporal.PlainDate.from('2026-01-05')
    expect(toTemporal(date)).toBe(date)
  })
})
