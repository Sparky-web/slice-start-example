import { describe, expect, it } from 'vitest'

import { isTimeZone } from './isTimeZone.ts'

describe('isTimeZone', () => {
  it('accepts IANA zones', () => {
    expect(isTimeZone('Europe/Moscow')).toBe(true)
    expect(isTimeZone('UTC')).toBe(true)
  })

  it('rejects garbage', () => {
    expect(isTimeZone('Mars/Olympus')).toBe(false)
    expect(isTimeZone('')).toBe(false)
    expect(isTimeZone(3)).toBe(false)
  })
})
