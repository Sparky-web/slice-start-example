import type { DataGridRequest } from '@repo/ui/dataGrid'

import type { ProjectListInput } from '~/entities/project'
import { listProjects, projectSortFields } from '~/entities/project'

type SortField = (typeof projectSortFields)[number]
const isSortField = (id: string): id is SortField => (projectSortFields as readonly string[]).includes(id)

/**
 * Maps an AG Grid block request to the `listProjects` server function.
 * Module-level, so the grid datasource stays stable between renders.
 */
export function fetchProjectRows({ offset, limit, sort, filter }: DataGridRequest) {
  const [first] = sort
  const nameFilter = filter['name'] as { filter?: string } | undefined
  const input: ProjectListInput = {
    offset,
    limit,
    search: nameFilter?.filter ?? '',
    ...(first && isSortField(first.colId) ? { sort: first.colId, desc: first.sort === 'desc' } : {}),
  }
  return listProjects({ data: input })
}
