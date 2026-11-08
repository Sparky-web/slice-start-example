import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

import { prisma } from '~/shared/db'

/** Вход, регистрация и сессии пользователей. Работает только на сервере. */
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  user: {
    additionalFields: {
      // Пользователь меняет пояс в профиле, поэтому при регистрации поле не принимается
      timeZone: { type: 'string', required: false, input: false },
    },
  },
  plugins: [tanstackStartCookies()],
})
