import { queryOptions } from '@tanstack/react-query'

import { getProject } from './projectApi.ts'

export const projectQueries = {
  all: () => ['projects'] as const,
  detail: (id: string) => queryOptions({ queryKey: [...projectQueries.all(), id], queryFn: () => getProject({ data: { id } }) }),
}
