import type { Meta, StoryObj } from '@storybook/react-vite'
import { infiniteQueryOptions } from '@tanstack/react-query'
import { useState } from 'react'

import { Badge } from '../Badge/Badge.tsx'
import type { DataPage, SortingState } from './DataTable.tsx'
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

const PAGE_SIZE = 50

function fetchPage(cursor: string | null, sorting: SortingState): Promise<DataPage<Row>> {
  const [sort] = sorting
  const sorted = sort
    ? all.toSorted((a, b) => {
        const key = sort.id as keyof Row
        return (a[key] > b[key] ? 1 : -1) * (sort.desc ? -1 : 1)
      })
    : all
  const start = Number(cursor ?? 0)
  return Promise.resolve({
    items: sorted.slice(start, start + PAGE_SIZE),
    nextCursor: start + PAGE_SIZE < sorted.length ? String(start + PAGE_SIZE) : null,
    total: sorted.length,
  })
}

function Demo() {
  const [sorting, setSorting] = useState<SortingState>([])
  const query = infiniteQueryOptions({
    queryKey: ['story-rows', sorting],
    queryFn: ({ pageParam }) => fetchPage(pageParam, sorting),
    initialPageParam: null as string | null,
    getNextPageParam: (page) => page.nextCursor,
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
