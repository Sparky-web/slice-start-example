import { formatDate } from '@repo/lib'
import type { DataGridColumn } from '@repo/ui/dataGrid'
import { DataGrid } from '@repo/ui/dataGrid'
import { useNavigate } from '@tanstack/react-router'

import type { ProjectListItem } from '~/entities/project'

import { fetchProjectRows } from '../../api/fetchProjectRows.ts'

const columns: DataGridColumn<ProjectListItem>[] = [
  {
    field: 'name',
    headerName: 'Проект',
    filter: 'agTextColumnFilter',
    filterParams: { filterOptions: ['contains'], maxNumConditions: 1 },
    minWidth: 200,
  },
  { field: 'description', headerName: 'Описание', sortable: false, flex: 2 },
  { field: 'taskCount', headerName: 'Задач', maxWidth: 120 },
  { field: 'doneCount', headerName: 'Готово', sortable: false, maxWidth: 120 },
  {
    field: 'createdAt',
    headerName: 'Создан',
    maxWidth: 160,
    valueFormatter: ({ value }: { value: string | null | undefined }) => (value ? formatDate(value, 'short') : ''),
  },
]

export function ProjectGrid() {
  const navigate = useNavigate()
  return (
    <DataGrid
      columns={columns}
      fetchRows={fetchProjectRows}
      getRowId={(project) => project.id}
      onRowClick={(project) => {
        void navigate({ to: '/projects/$projectId', params: { projectId: project.id } })
      }}
    />
  )
}
