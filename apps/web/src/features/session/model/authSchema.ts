import { z } from 'zod'

import { userNameSchema } from '~/entities/user'

/** Данные для входа: почта и пароль. */
export const signInSchema = z.object({
  email: z.email('Введите корректную почту'),
  password: z.string().min(1, 'Введите пароль'),
})

/** Данные для регистрации. Пользователь соглашается с условиями до создания аккаунта. */
export const signUpSchema = z.object({
  name: userNameSchema,
  email: z.email('Введите корректную почту'),
  password: z.string().min(8, 'Минимум 8 символов'),
  acceptTerms: z.boolean().refine(Boolean, 'Нужно согласие с условиями'),
})
