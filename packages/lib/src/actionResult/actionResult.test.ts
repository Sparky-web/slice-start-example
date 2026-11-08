import { describe, expect, expectTypeOf, it } from 'vitest'

import type { ActionResult } from './actionResult.ts'
import { fail, ok } from './actionResult.ts'

type SaveError = { code: 'TAKEN'; field: 'title'; params: { title: string } } | { code: 'GONE' }

const save = (title: string): ActionResult<{ id: string }, SaveError> =>
  title === 'дубль' ? fail({ code: 'TAKEN', field: 'title', params: { title } }) : ok({ id: '1' })

describe('actionResult', () => {
  it('returns data on success', () => {
    expect(save('новая')).toEqual({ ok: true, data: { id: '1' } })
  })

  it('returns a typed error', () => {
    const result = save('дубль')
    expect(result).toEqual({ ok: false, error: { code: 'TAKEN', field: 'title', params: { title: 'дубль' } } })
    if (!result.ok && result.error.code === 'TAKEN') expectTypeOf(result.error.params.title).toEqualTypeOf<string>()
  })
})
