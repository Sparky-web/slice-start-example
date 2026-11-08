import type { ListRequest } from '@repo/ui'
import { DateTime } from '@repo/ui'
import type { DataGridColumn } from '@repo/ui/dataGrid'
import { DataGrid } from '@repo/ui/dataGrid'
import { useNavigate } from '@tanstack/react-router'

import type { ProjectListItem } from '~/entities/project'
import { listProjects } from '~/entities/project'

/** Ячейка с датой создания проекта. */
interface CreatedAtCellProps {
  /** Момент создания. */
  value: string | null | undefined
}

function CreatedAtCell({ value }: CreatedAtCellProps) {
  return value ? <DateTime value={value} preset="short" /> : null
}

const columns: DataGridColumn<ProjectListItem>[] = [
  {
    field: 'name',
    headerName: 'Проект',
    filter: 'agTextColumnFilter',
    filterParams: { filterOptions: ['contains'], maxNumConditions: 1 },
    minWidth: 200,
  },
  { field: 'description', headerName: 'Описание', sortable: false, flex: 2 },
  { field: 'taskCount', headerName: 'Задач', sortable: false, maxWidth: 120 },
  { field: 'doneCount', headerName: 'Готово', sortable: false, maxWidth: 120 },
  { field: 'createdAt', headerName: 'Создан', maxWidth: 160, cellRenderer: CreatedAtCell },
]

// Постоянная функция: новая функция на каждой отрисовке перезагружала бы грид
const fetchProjectRows = (request: ListRequest) => listProjects({ data: request })

/** Грид проектов пользователя: поиск по названию, упорядочивание и переход в проект по нажатию. */
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
