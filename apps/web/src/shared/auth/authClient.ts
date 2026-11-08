import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient()

/** Unwraps Better Auth `{ data, error }` results so mutations reject with a readable message. */
export async function unwrapAuth<T>(request: Promise<{ data: T; error: null } | { data: null; error: { message?: string | undefined } }>): Promise<T> {
  const result = await request
  if (result.error) throw new Error(result.error.message ?? 'Ошибка авторизации')
  return result.data
}
