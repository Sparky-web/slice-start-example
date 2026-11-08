import { describe, expect, it } from 'vitest'

import { ensureTemporal } from './ensureTemporal.ts'

describe('ensureTemporal', () => {
  it('makes Temporal available', async () => {
    await ensureTemporal()
    expect(Temporal.PlainDate.from('2026-01-05').day).toBe(5)
  })
})
