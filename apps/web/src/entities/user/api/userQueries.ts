import { queryOptions } from '@tanstack/react-query'

import { getCurrentUser } from './userApi.ts'

export const userQueries = {
  current: () => queryOptions({ queryKey: ['user', 'current'], queryFn: () => getCurrentUser() }),
}
