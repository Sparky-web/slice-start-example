import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { listRequestSchema } from './listRequestSchema.ts'

const schema = listRequestSchema(z.object({ q: z.string().optional() }))

describe('listRequestSchema', () => {
  it('accepts a page request', () => {
    expect(schema.parse({ offset: 0, limit: 50, filters: {} })).toEqual({ offset: 0, limit: 50, filters: {} })
  })

  it('rejects oversized pages', () => {
    expect(() => schema.parse({ offset: 0, limit: 10_000, filters: {} })).toThrow()
  })
})
