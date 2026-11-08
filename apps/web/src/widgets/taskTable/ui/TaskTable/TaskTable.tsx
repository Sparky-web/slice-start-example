import { formatDate } from '@repo/lib'
import { createDataTableColumns, DataTable, Input, Select, Text } from '@repo/ui'
import { useState } from 'react'

import type { TaskListItem, TaskListSearch, TaskStatus } from '~/entities/task'
import { TaskPriorityBadge, taskQueries, TaskStatusBadge, taskStatusOptions } from '~/entities/task'
import { CreateTaskDialog } from '~/features/createTask'
import { EditTaskDialog } from '~/features/editTask'

import { fromSorting, toSorting } from '../../model/taskSorting.ts'

const column = createDataTableColumns<TaskListItem>()
const columns = column.columns([
  column.accessor('title', {
    header: 'Задача',
    size: 280,
    cell: (info) => (
      <Text size="sm" weight="medium" truncate>
        {info.getValue()}
      </Text>
    ),
  }),
  column.accessor('status', { header: 'Статус', size: 140, cell: (info) => <TaskStatusBadge status={info.getValue()} /> }),
  column.accessor('priority', { header: 'Приоритет', size: 120, cell: (info) => <TaskPriorityBadge priority={info.getValue()} /> }),
  column.accessor('dueDate', {
    header: 'Срок',
    size: 120,
    cell: (info) => {
      const value = info.getValue()
      return value ? formatDate(value, 'short') : '—'
    },
  }),
  column.accessor('createdAt', { header: 'Создана', size: 120, cell: (info) => formatDate(info.getValue(), 'short') }),
])

const statusFilterOptions = [{ value: 'ALL' as const, label: 'Все статусы' }, ...taskStatusOptions]

export interface TaskTableProps {
  projectId: string
  /** Filters and sorting from the URL. */
  search: TaskListSearch
  onSearchChange: (search: TaskListSearch) => void
}

export function TaskTable({ projectId, search, onSearchChange }: TaskTableProps) {
  const [editing, setEditing] = useState<TaskListItem | null>(null)

  return (
    <>
      <DataTable
        columns={columns}
        query={taskQueries.list(projectId, search)}
        getRowId={(task) => task.id}
        sorting={toSorting(search)}
        onSortingChange={(sorting) => {
          onSearchChange({ ...search, ...fromSorting(sorting) })
        }}
        onRowClick={setEditing}
        emptyTitle="Задач нет"
        emptyDescription="Создайте первую задачу или измените фильтры"
        toolbar={
          <>
            <Input
              type="search"
              placeholder="Поиск по названию"
              aria-label="Поиск по названию"
              value={search.q ?? ''}
              onValueChange={(q) => {
                onSearchChange({ ...search, q: q || undefined })
              }}
              className="w-auto"
            />
            <Select<TaskStatus | 'ALL'>
              options={statusFilterOptions}
              value={search.status ?? 'ALL'}
              onValueChange={(status) => {
                onSearchChange({ ...search, status: status === 'ALL' || status === null ? undefined : status })
              }}
              className="w-auto"
            />
            <CreateTaskDialog projectId={projectId} />
          </>
        }
      />
      <EditTaskDialog
        projectId={projectId}
        task={editing}
        onClose={() => {
          setEditing(null)
        }}
      />
    </>
  )
}
