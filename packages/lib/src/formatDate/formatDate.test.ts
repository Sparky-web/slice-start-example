import { describe, expect, it } from 'vitest'

import { formatDate } from './formatDate.ts'

const moment = '2026-01-05T21:30:00.000Z'

describe('formatDate', () => {
  it('shows a moment in the given time zone', () => {
    expect(formatDate(moment, { timeZone: 'Europe/Moscow' })).toBe('6 января 2026 г.')
    expect(formatDate(moment, { timeZone: 'America/New_York' })).toBe('5 января 2026 г.')
  })

  it('supports presets', () => {
    expect(formatDate(moment, { preset: 'short', timeZone: 'Europe/Moscow' })).toBe('06.01.2026')
    expect(formatDate(moment, { preset: 'time', timeZone: 'Europe/Moscow' })).toBe('00:30')
    expect(formatDate(moment, { preset: 'dateTime', timeZone: 'UTC' })).toMatch(/^5 января 2026 г\.(,| в) 21:30$/)
  })

  it('never shifts calendar dates', () => {
    expect(formatDate('2026-01-05', { preset: 'short', timeZone: 'Pacific/Kiritimati' })).toBe('05.01.2026')
    expect(formatDate('2026-01-05', { preset: 'dateTime', timeZone: 'Pacific/Pago_Pago' })).toBe('5 января 2026 г.')
  })
})
