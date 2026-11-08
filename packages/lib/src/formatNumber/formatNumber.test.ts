import { describe, expect, it } from 'vitest'

import { formatNumber } from './formatNumber.ts'

const normalize = (value: string) => value.replaceAll(/\s/g, ' ')

describe('formatNumber', () => {
  it('uses Russian grouping and decimal separator', () => {
    expect(normalize(formatNumber(1234.5))).toBe('1 234,5')
  })

  it('passes Intl options', () => {
    expect(normalize(formatNumber(1500, { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }))).toBe('1 500 ₽')
  })
})
