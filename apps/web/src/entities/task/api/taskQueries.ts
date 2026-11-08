import { listQueryOptions } from '@repo/ui'

import type { TaskListSearch } from '../model/taskSchema.ts'
import { listTasks } from './taskApi.ts'

/** Ключи кэша задач: от всех задач к спискам одного проекта. */
export const taskKeys = {
  /** Все задачи. */
  all: ['tasks'] as const,
  /** Задачи одного проекта. Сброс обновляет все списки проекта. */
  project: (projectId: string) => [...taskKeys.all, projectId] as const,
  /** Список задач проекта с отбором и порядком. */
  list: (projectId: string, search: TaskListSearch) => [...taskKeys.project(projectId), 'list', search] as const,
}

/** Запросы задач для страниц и таблиц. */
export const taskQueries = {
  /** Список задач проекта с отбором и порядком из адреса страницы. */
  list: (projectId: string, search: TaskListSearch) =>
    listQueryOptions({
      queryKey: taskKeys.list(projectId, search),
      fetchPage: (page) =>
        listTasks({ data: { ...page, projectId, sort: search.sort, desc: search.desc, filters: { status: search.status, q: search.q } } }),
    }),
}
