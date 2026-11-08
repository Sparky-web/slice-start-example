import { z } from 'zod'

export const userNameSchema = z.string().trim().min(2, 'Минимум 2 символа').max(60, 'Максимум 60 символов')
