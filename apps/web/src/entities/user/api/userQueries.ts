import { queryOptions } from '@tanstack/react-query'

import { getCurrentUser } from './userApi.ts'

/** Ключи кэша пользователя. */
export const userKeys = {
  /** Пользователь, который сейчас на сайте. */
  current: ['user', 'current'] as const,
}

/** Запросы пользователя для страниц. */
export const userQueries = {
  /** Пользователь, который сейчас на сайте. */
  current: () => queryOptions({ queryKey: userKeys.current, queryFn: () => getCurrentUser() }),
}
