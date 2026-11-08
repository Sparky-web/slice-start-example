import { listQueryOptions } from '@repo/ui'

import type { TaskListSearch } from '../model/taskSchema.ts'
import { listTasks } from './taskApi.ts'

/** Данные задач для страниц и таблиц. */
export const taskQueries = {
  /** Все списки задач проекта. Списки обновляются вместе после изменения задачи. */
  all: (projectId: string) => ['tasks', projectId] as const,
  /** Список задач проекта с отбором и порядком из адреса страницы. */
  list: (projectId: string, search: TaskListSearch) =>
    listQueryOptions({
      queryKey: [...taskQueries.all(projectId), 'list', search],
      fetchPage: (page) =>
        listTasks({ data: { ...page, projectId, sort: search.sort, desc: search.desc, filters: { status: search.status, q: search.q } } }),
    }),
}
