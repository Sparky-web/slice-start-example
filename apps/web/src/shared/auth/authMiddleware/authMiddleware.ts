import { createMiddleware, createServerOnlyFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

import { auth } from '../auth.server.ts'

export interface SessionUser {
  id: string
  name: string
  email: string
}

/** Reads the session cookie. Returns `null` for guests. Server-only: stripped from the client bundle. */
export const readSessionUser = createServerOnlyFn(async (): Promise<SessionUser | null> => {
  const session = await auth.api.getSession({ headers: getRequestHeaders() })
  return session ? { id: session.user.id, name: session.user.name, email: session.user.email } : null
})

/** Server function middleware: rejects guests and puts the user into `context.user`. */
export const authMiddleware = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  const user = await readSessionUser()
  if (!user) throw new Error('Требуется вход в аккаунт')
  return next({ context: { user } })
})
