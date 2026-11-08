import { describe, expect, it } from 'vitest'

import { timeZoneOptions } from './timeZoneOptions.ts'

describe('timeZoneOptions', () => {
  it('lists zones with offsets, west to east', () => {
    const options = timeZoneOptions()
    expect(options.find((option) => option.value === 'Europe/Moscow')?.label).toBe('Moscow (UTC+03:00)')
    const moscow = options.findIndex((option) => option.value === 'Europe/Moscow')
    const london = options.findIndex((option) => option.value === 'Europe/London')
    expect(london).toBeLessThan(moscow)
  })
})
