import { describe, expect, it } from 'vitest'

import { pluralize } from './pluralize.ts'

const forms = ['задача', 'задачи', 'задач'] as const

describe('pluralize', () => {
  it.each([
    [1, 'задача'],
    [2, 'задачи'],
    [5, 'задач'],
    [11, 'задач'],
    [21, 'задача'],
    [104, 'задачи'],
  ])('%i → %s', (count, expected) => {
    expect(pluralize(count, forms)).toBe(expected)
  })
})
