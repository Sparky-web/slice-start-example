import { describe, expect, it } from 'vitest'

import { searchKey } from './searchKey.ts'

describe('searchKey', () => {
  it('ignores case, ё and extra spaces', () => {
    expect(searchKey('  Отчёт   ПО продажам ')).toBe('отчет по продажам')
    expect(searchKey('Аналитика')).toBe(searchKey('аналитика'))
  })
})
