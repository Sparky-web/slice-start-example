import { describe, expect, it } from 'vitest'

import { isTimeZone } from '../isTimeZone/isTimeZone.ts'
import { deviceTimeZone } from './deviceTimeZone.ts'

describe('deviceTimeZone', () => {
  it('returns a valid time zone', () => {
    expect(isTimeZone(deviceTimeZone())).toBe(true)
  })
})
