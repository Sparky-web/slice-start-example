import { describe, expect, it } from 'vitest'

import { pageArgs } from './pageArgs.ts'

const fields = ['title', 'createdAt'] as const

describe('pageArgs', () => {
  it('sorts by an allowed field', () => {
    expect(pageArgs({ offset: 50, limit: 50, sort: 'title', desc: false }, fields, 'createdAt')).toEqual({
      skip: 50,
      take: 50,
      orderBy: [{ title: 'asc' }, { id: 'asc' }],
    })
  })

  it('falls back to newest first for unknown fields', () => {
    expect(pageArgs({ offset: 0, limit: 10, sort: 'password' }, fields, 'createdAt').orderBy[0]).toEqual({ createdAt: 'desc' })
  })
})
