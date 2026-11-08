import { describe, expect, it } from 'vitest'

import { invariant } from './invariant.ts'

describe('invariant', () => {
  it('passes on truthy values', () => {
    expect(() => { invariant(1, 'never') }).not.toThrow()
  })

  it('throws with the message on falsy values', () => {
    expect(() => { invariant(null, 'User is required') }).toThrow('User is required')
  })
})
