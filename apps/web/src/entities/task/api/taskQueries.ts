import { infiniteQueryOptions } from '@tanstack/react-query'

import type { TaskListSearch } from '../model/taskSchema.ts'
import { listTasks } from './taskApi.ts'

export const taskQueries = {
  /** Prefix for invalidation of every task list of a project. */
  all: (projectId: string) => ['tasks', projectId] as const,
  list: (projectId: string, search: TaskListSearch) =>
    infiniteQueryOptions({
      queryKey: [...taskQueries.all(projectId), 'list', search],
      queryFn: ({ pageParam }) => listTasks({ data: { ...search, projectId, cursor: pageParam } }),
      initialPageParam: null as string | null,
      getNextPageParam: (page) => page.nextCursor,
    }),
}
