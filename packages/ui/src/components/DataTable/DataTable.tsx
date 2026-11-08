import { formatNumber, pluralize } from '@repo/lib'
import type { InfiniteData, QueryKey, UseInfiniteQueryOptions } from '@tanstack/react-query'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import type { ColumnDef, RowData, SortingState } from '@tanstack/react-table'
import {
  columnSizingFeature,
  createColumnHelper,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { useRef } from 'react'

import { cn } from '../../lib/cn/cn.ts'
import { Alert } from '../Alert/Alert.tsx'
import { EmptyState } from '../EmptyState/EmptyState.tsx'
import { Skeleton } from '../Skeleton/Skeleton.tsx'
import { Spinner } from '../Spinner/Spinner.tsx'
import { Text } from '../Text/Text.tsx'

/** Features shared by every table in the app. Add features here, not in modules. */
export const dataTableFeatures = tableFeatures({ rowSortingFeature, columnSizingFeature })
export type DataTableFeatures = typeof dataTableFeatures
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- columns of one table have different value types, same as in TanStack Table itself
export type DataTableColumn<TData extends RowData> = ColumnDef<DataTableFeatures, TData, any>
export type { SortingState }

/** Typed column helper bound to the shared table features. */
export const createDataTableColumns = <TData extends RowData>() => createColumnHelper<DataTableFeatures, TData>()

/** A page returned by a server function for infinite tables. */
export interface DataPage<TData> {
  items: TData[]
  nextCursor: string | null
  total: number
}

export type DataTableQuery<TData, TQueryKey extends QueryKey = QueryKey> = UseInfiniteQueryOptions<
  DataPage<TData>,
  Error,
  InfiniteData<DataPage<TData>>,
  TQueryKey,
  string | null
>

export interface DataTableProps<TData extends RowData, TQueryKey extends QueryKey = QueryKey> {
  columns: readonly DataTableColumn<TData>[]
  /** `infiniteQueryOptions(...)` that returns `DataPage<TData>` pages. */
  query: DataTableQuery<TData, TQueryKey>
  getRowId: (row: TData) => string
  /** Server-side sorting state, usually stored in route search params. */
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  onRowClick?: (row: TData) => void
  toolbar?: ReactNode
  emptyTitle?: string
  emptyDescription?: string
  className?: string
}

const ROW_HEIGHT = 48
const LOAD_MORE_THRESHOLD = 10
const emptyRows: never[] = []
const noSorting: SortingState = []

/**
 * The single table for the app: server-side sorting, infinite loading by pages
 * and row virtualization. Modules only describe columns and a query.
 */
export function DataTable<TData extends RowData, TQueryKey extends QueryKey = QueryKey>({
  columns,
  query,
  getRowId,
  sorting = noSorting,
  onSortingChange,
  onRowClick,
  toolbar,
  emptyTitle = 'Ничего не найдено',
  emptyDescription,
  className,
}: DataTableProps<TData, TQueryKey>) {
  const result = useInfiniteQuery({ ...query, placeholderData: keepPreviousData })
  const data = result.data?.pages.flatMap((page) => page.items) ?? emptyRows
  const total = result.data?.pages.at(-1)?.total ?? 0

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    getRowId,
    manualSorting: true,
    enableSortingRemoval: true,
    state: { sorting },
    onSortingChange: (updater) => {
      onSortingChange?.(typeof updater === 'function' ? updater(sorting) : updater)
    },
  })

  const scrollRef = useRef<HTMLDivElement>(null)
  const rows = table.getRowModel().rows
  // eslint-disable-next-line react-hooks/incompatible-library -- the project does not use React Compiler, the virtualizer is safe here
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    getItemKey: (index) => rows[index]?.id ?? index,
    overscan: 8,
    onChange: (instance) => {
      const last = instance.getVirtualItems().at(-1)
      if (last && last.index >= rows.length - LOAD_MORE_THRESHOLD && result.hasNextPage && !result.isFetchingNextPage) {
        void result.fetchNextPage()
      }
    },
  })
  const virtualRows = virtualizer.getVirtualItems()
  const gridTemplateColumns = table
    .getAllLeafColumns()
    .map((column) => `minmax(${String(column.getSize())}px, 1fr)`)
    .join(' ')

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {(toolbar !== undefined || result.data !== undefined) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">{toolbar}</div>
          <Text size="sm" tone="muted">
            {`${formatNumber(total)} ${pluralize(total, ['запись', 'записи', 'записей'])}`}
          </Text>
        </div>
      )}
      {result.isError ? (
        <Alert tone="destructive" title="Не удалось загрузить данные">
          {result.error.message}
        </Alert>
      ) : (
        <div ref={scrollRef} className="max-h-(--data-table-max-height) overflow-auto rounded-lg border bg-card">
          <table className="grid w-full text-sm">
            <thead className="sticky top-0 z-10 grid border-b bg-muted">
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id} className="grid" style={{ gridTemplateColumns }}>
                  {group.headers.map((header) => (
                    <th
                      key={header.id}
                      aria-sort={ariaSort(header.column.getIsSorted())}
                      className="flex items-center px-4 py-3 text-left font-medium text-muted-foreground"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <SortButton direction={header.column.getIsSorted()} onToggle={header.column.getToggleSortingHandler()}>
                          <table.FlexRender header={header} />
                        </SortButton>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="relative grid" style={{ height: virtualizer.getTotalSize() }}>
              {virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index]
                if (!row) return null
                return (
                  <tr
                    key={row.id}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    onClick={onRowClick ? () => { onRowClick(row.original) } : undefined}
                    className={cn(
                      'absolute grid w-full border-b transition-colors last:border-b-0 hover:bg-muted/50',
                      onRowClick && 'cursor-pointer',
                    )}
                    style={{ gridTemplateColumns, transform: `translateY(${String(virtualRow.start)}px)` }}
                  >
                    {row.getAllCells().map((cell) => (
                      <td key={cell.id} className="flex min-w-0 items-center px-4 py-3">
                        <table.FlexRender cell={cell} />
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
          <TableStatus
            isPending={result.isPending}
            isEmpty={result.isSuccess && rows.length === 0}
            isFetchingNextPage={result.isFetchingNextPage}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        </div>
      )}
    </div>
  )
}

interface TableStatusProps {
  isPending: boolean
  isEmpty: boolean
  isFetchingNextPage: boolean
  emptyTitle: string
  emptyDescription: string | undefined
}

function TableStatus({ isPending, isEmpty, isFetchingNextPage, emptyTitle, emptyDescription }: TableStatusProps) {
  if (isPending) {
    return (
      <div className="flex flex-col gap-3 p-4">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    )
  }
  if (isEmpty) {
    return <EmptyState title={emptyTitle} {...(emptyDescription === undefined ? {} : { description: emptyDescription })} />
  }
  if (isFetchingNextPage) {
    return (
      <div className="flex justify-center p-4 text-muted-foreground">
        <Spinner size="sm" />
      </div>
    )
  }
  return null
}

const ariaSort = (direction: false | 'asc' | 'desc') =>
  direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none'

interface SortButtonProps {
  direction: false | 'asc' | 'desc'
  onToggle: ((event: unknown) => void) | undefined
  children: ReactNode
}

function SortButton({ direction, onToggle, children }: SortButtonProps) {
  const Icon = direction === 'asc' ? ArrowUp : direction === 'desc' ? ArrowDown : ArrowUpDown
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-1 rounded-sm transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
      <Icon className={cn('size-3', direction === false && 'opacity-50')} />
    </button>
  )
}
