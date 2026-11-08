import type { SortingState } from '@repo/ui'

import type { TaskListSearch } from '~/entities/task'
import { taskSortFields } from '~/entities/task'

/** Порядок задач из адреса страницы для таблицы. Без выбора пользователя порядок не задан. */
export const toSorting = (search: TaskListSearch): SortingState =>
  search.sort ? [{ id: search.sort, desc: search.desc ?? true }] : []

/** Порядок задач из таблицы для адреса страницы. Поля вне списка разрешённых сбрасывают порядок. */
export function fromSorting(sorting: SortingState): Pick<TaskListSearch, 'sort' | 'desc'> {
  const [first] = sorting
  const sort = taskSortFields.find((field) => field === first?.id)
  return sort && first ? { sort, desc: first.desc } : { sort: undefined, desc: undefined }
}
