import type { SortingState } from '@repo/ui'

import type { TaskListSearch, TaskSortField } from '~/entities/task'
import { taskSortFields } from '~/entities/task'

const isSortField = (id: string): id is TaskSortField => (taskSortFields as readonly string[]).includes(id)

/** URL search → table sorting state. */
export const toSorting = (search: TaskListSearch): SortingState =>
  search.sort ? [{ id: search.sort, desc: search.desc ?? true }] : []

/** Table sorting state → URL search. */
export function fromSorting(sorting: SortingState): Pick<TaskListSearch, 'sort' | 'desc'> {
  const [first] = sorting
  return first && isSortField(first.id) ? { sort: first.id, desc: first.desc } : { sort: undefined, desc: undefined }
}
