import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import type { ListPage } from '../../list/listQuery.ts'
import { listQueryOptions } from '../../list/listQuery.ts'
import { Badge } from '../Badge/Badge.tsx'
import type { SortingState } from './DataTable.tsx'
import { createDataTableColumns, DataTable } from './DataTable.tsx'

interface Row {
  id: string
  title: string
  status: 'todo' | 'done'
  points: number
}

const all: Row[] = Array.from({ length: 500 }, (_, index) => ({
  id: String(index + 1),
  title: `Задача №${String(index + 1)}`,
  status: index % 3 === 0 ? 'done' : 'todo',
  points: (index * 7) % 13,
}))

const column = createDataTableColumns<Row>()
const columns = column.columns([
  column.accessor('title', { header: 'Название', size: 240 }),
  column.accessor('status', {
    header: 'Статус',
    cell: (info) => <Badge tone={info.getValue() === 'done' ? 'success' : 'info'}>{info.getValue() === 'done' ? 'Готово' : 'В работе'}</Badge>,
  }),
  column.accessor('points', { header: 'Оценка', size: 100 }),
])

const compare = (a: Row, b: Row, field: string) => {
  if (field === 'points') return a.points - b.points
  if (field === 'status') return a.status.localeCompare(b.status)
  return a.title.localeCompare(b.title)
}

function fetchPage(offset: number, limit: number, sorting: SortingState): Promise<ListPage<Row>> {
  const [sort] = sorting
  const sorted = sort ? all.toSorted((a, b) => compare(a, b, sort.id) * (sort.desc ? -1 : 1)) : all
  return Promise.resolve({ items: sorted.slice(offset, offset + limit), total: sorted.length })
}

function Demo() {
  const [sorting, setSorting] = useState<SortingState>([])
  const query = listQueryOptions({
    queryKey: ['story-rows', sorting],
    fetchPage: ({ offset, limit }) => fetchPage(offset, limit, sorting),
  })
  return <DataTable columns={columns} query={query} getRowId={(row) => row.id} sorting={sorting} onSortingChange={setSorting} />
}

const meta = {
  title: 'Data/DataTable',
  component: Demo,
} satisfies Meta<typeof Demo>

export default meta
type Story = StoryObj<typeof meta>

export const InfiniteWithSorting: Story = {}
