import { z } from 'zod'

import { userNameSchema } from '~/entities/user'

export const signInSchema = z.object({
  email: z.email('Введите корректную почту'),
  password: z.string().min(1, 'Введите пароль'),
})

export const signUpSchema = z.object({
  name: userNameSchema,
  email: z.email('Введите корректную почту'),
  password: z.string().min(8, 'Минимум 8 символов'),
  acceptTerms: z.boolean().refine(Boolean, 'Нужно согласие с условиями'),
})
