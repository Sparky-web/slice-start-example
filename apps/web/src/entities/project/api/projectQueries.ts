import { queryOptions } from '@tanstack/react-query'

import { getProject } from './projectApi.ts'

/** Ключи кэша проектов. */
export const projectKeys = {
  /** Все проекты. */
  all: ['projects'] as const,
  /** Один проект со счётчиками задач. */
  detail: (id: string) => [...projectKeys.all, id] as const,
}

/** Запросы проектов для страниц. */
export const projectQueries = {
  /** Проект со счётчиками задач. */
  detail: (id: string) => queryOptions({ queryKey: projectKeys.detail(id), queryFn: () => getProject({ data: { id } }) }),
}
