import { isTimeZone } from '@repo/lib'
import { createMiddleware, createServerOnlyFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

import { auth } from '../auth.server.ts'

/** Пользователь, который вошёл на сайт. */
export interface SessionUser {
  /** Постоянный идентификатор пользователя. */
  id: string
  /** Имя для приветствия и подписи действий. */
  name: string
  /** Почта для входа. */
  email: string
  /** Часовой пояс для дат. Пустое значение означает пояс сайта или устройства. */
  timeZone: string | null
}

/** Пользователь текущего запроса. Гость получает пустое значение. Работает только на сервере. */
export const readSessionUser = createServerOnlyFn(async (): Promise<SessionUser | null> => {
  const session = await auth.api.getSession({ headers: getRequestHeaders() })
  if (!session) return null
  const { id, name, email, timeZone } = session.user
  return { id, name, email, timeZone: isTimeZone(timeZone) ? timeZone : null }
})

/** Закрывает серверное действие от гостей. Действие знает, кто его выполняет. */
export const authMiddleware = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  const user = await readSessionUser()
  if (!user) throw new Error('Требуется вход в аккаунт')
  return next({ context: { user } })
})
