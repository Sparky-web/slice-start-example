import { queryOptions } from '@tanstack/react-query'

import { getCurrentUser } from './userApi.ts'

/** Данные пользователя для страниц. */
export const userQueries = {
  /** Пользователь, который сейчас на сайте. */
  current: () => queryOptions({ queryKey: ['user', 'current'], queryFn: () => getCurrentUser() }),
}
