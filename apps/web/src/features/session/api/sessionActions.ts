import type { ActionResult } from '@repo/lib'
import { fail, ok } from '@repo/lib'

import { authClient, authErrorCode } from '~/shared/auth'

import type { SignInError, SignUpError } from '../model/sessionErrors.ts'

/** Данные для входа. */
export interface SignInValues {
  /** Почта аккаунта. */
  email: string
  /** Пароль аккаунта. */
  password: string
}

/** Данные для регистрации. */
export interface SignUpValues extends SignInValues {
  /** Имя пользователя. */
  name: string
}

/** Входит в аккаунт по почте и паролю. */
export async function signIn(values: SignInValues): Promise<ActionResult<null, SignInError>> {
  const { error } = await authClient.signIn.email(values)
  if (!error) return ok(null)
  return authErrorCode(error) === 'INVALID_EMAIL_OR_PASSWORD'
    ? fail<SignInError>({ code: 'INVALID_CREDENTIALS', field: 'password' })
    : fail<SignInError>({ code: 'AUTH_FAILED' })
}

/** Создаёт аккаунт и сразу входит в него. */
export async function signUp(values: SignUpValues): Promise<ActionResult<null, SignUpError>> {
  const { error } = await authClient.signUp.email(values)
  if (!error) return ok(null)
  return authErrorCode(error)?.startsWith('USER_ALREADY_EXISTS') === true
    ? fail<SignUpError>({ code: 'EMAIL_TAKEN', field: 'email', params: { email: values.email } })
    : fail<SignUpError>({ code: 'AUTH_FAILED' })
}
