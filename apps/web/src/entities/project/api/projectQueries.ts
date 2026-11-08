import { queryOptions } from '@tanstack/react-query'

import { getProject } from './projectApi.ts'

/** Данные проектов для страниц. */
export const projectQueries = {
  /** Все данные проектов. Данные обновляются вместе после изменений. */
  all: () => ['projects'] as const,
  /** Проект со счётчиками задач. */
  detail: (id: string) => queryOptions({ queryKey: [...projectQueries.all(), id], queryFn: () => getProject({ data: { id } }) }),
}
