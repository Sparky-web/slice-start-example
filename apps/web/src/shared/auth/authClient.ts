import { createAuthClient } from 'better-auth/react'

/** Вход, регистрация и выход из браузера. */
export const authClient = createAuthClient()

/** Результат обращения к авторизации: данные или ошибка с понятным текстом. */
type AuthResult<T> = { data: T; error: null } | { data: null; error: { message?: string | undefined } }

/** Превращает отказ авторизации в ошибку с понятным пользователю текстом. */
export async function unwrapAuth<T>(request: Promise<AuthResult<T>>): Promise<T> {
  const result = await request
  if (result.error) throw new Error(result.error.message ?? 'Ошибка авторизации')
  return result.data
}
