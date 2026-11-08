import { formatNumber, pluralize } from '@repo/lib'
import type { InfiniteData, QueryKey, UseInfiniteQueryOptions } from '@tanstack/react-query'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import type { ColumnDef, RowData, SortingState } from '@tanstack/react-table'
import { columnSizingFeature, createColumnHelper, rowSortingFeature, tableFeatures, useTable } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { useRef } from 'react'

import { cn } from '../../lib/cn/cn.ts'
import type { ListPage } from '../../list/listQuery.ts'
import { Alert } from '../Alert/Alert.tsx'
import { EmptyState } from '../EmptyState/EmptyState.tsx'
import { Skeleton } from '../Skeleton/Skeleton.tsx'
import { Spinner } from '../Spinner/Spinner.tsx'
import { Text } from '../Text/Text.tsx'

/** Возможности, общие для всех таблиц приложения: упорядочивание и ширина колонок. */
export const dataTableFeatures = tableFeatures({ rowSortingFeature, columnSizingFeature })

/** Набор возможностей таблиц приложения. */
export type DataTableFeatures = typeof dataTableFeatures

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- у колонок одной таблицы разные типы значений, как и в самой библиотеке таблиц
export type DataTableColumn<TData extends RowData> = ColumnDef<DataTableFeatures, TData, any>
export type { SortingState }

/** Помощник для описания колонок таблицы с проверкой полей строки. */
export const createDataTableColumns = <TData extends RowData>() => createColumnHelper<DataTableFeatures, TData>()

/** Описание списка с подгрузкой порциями, который показывает таблица. */
export type DataTableQuery<TData, TQueryKey extends QueryKey = QueryKey> = UseInfiniteQueryOptions<
  ListPage<TData>,
  Error,
  InfiniteData<ListPage<TData>>,
  TQueryKey,
  number
>

/** Настройки таблицы данных. */
export interface DataTableProps<TData extends RowData, TQueryKey extends QueryKey = QueryKey> {
  /** Какие колонки показать и как отобразить значения. */
  columns: readonly DataTableColumn<TData>[]
  /** Откуда брать строки: список, который подгружается порциями. */
  query: DataTableQuery<TData, TQueryKey>
  /** Постоянный идентификатор строки, чтобы таблица не путала записи при обновлении. */
  getRowId: (row: TData) => string
  /** Текущее упорядочивание, обычно хранится в адресе страницы. */
  sorting?: SortingState
  /** Пользователь изменил упорядочивание. */
  onSortingChange?: (sorting: SortingState) => void
  /** Пользователь выбрал строку. */
  onRowClick?: (row: TData) => void
  /** Поиск, фильтры и действия над таблицей. */
  toolbar?: ReactNode
  /** Заголовок, когда ничего не найдено. */
  emptyTitle?: string
  /** Подсказка, когда ничего не найдено. */
  emptyDescription?: string
  /** Редкое исключение для раскладки на странице. */
  className?: string
}

const ROW_HEIGHT = 48
const LOAD_MORE_THRESHOLD = 10
const noRows: never[] = []
const noSorting: SortingState = []

/**
 * Единая таблица приложения: подгружает строки порциями при прокрутке,
 * упорядочивает их на сервере и быстро показывает тысячи записей.
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
  const data: TData[] = result.data?.pages.flatMap((page) => page.items) ?? noRows
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
  // eslint-disable-next-line react-hooks/incompatible-library -- проект не использует автоматическую мемоизацию, виртуализация здесь безопасна
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    getItemKey: (index) => rows[index]?.id ?? index,
    overscan: 8,
    onChange: (instance) => {
      const last = instance.getVirtualItems().at(-1)
      if (last && last.index >= rows.length - LOAD_MORE_THRESHOLD && result.hasNextPage && !result.isFetchingNextPage) {
        // Без отключения перезапуска каждая прокрутка заново отправляла бы тот же запрос
        void result.fetchNextPage({ cancelRefetch: false })
      }
    },
  })
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
        // Новый запрос (фильтры, порядок) начинается сверху: пересоздание сбрасывает прокрутку
        <div
          key={JSON.stringify(query.queryKey)}
          ref={scrollRef}
          className="max-h-(--data-table-max-height) overflow-auto rounded-lg border bg-card"
        >
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
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index]
                if (!row) return null
                return (
                  <tr
                    key={row.id}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    onClick={
                      onRowClick
                        ? () => {
                            onRowClick(row.original)
                          }
                        : undefined
                    }
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

/** Состояние таблицы под строками. */
interface TableStatusProps {
  /** Первая порция ещё загружается. */
  isPending: boolean
  /** Ничего не найдено. */
  isEmpty: boolean
  /** Подгружается следующая порция. */
  isFetchingNextPage: boolean
  /** Заголовок, когда ничего не найдено. */
  emptyTitle: string
  /** Подсказка, когда ничего не найдено. */
  emptyDescription: string | undefined
}

/** Заглушки загрузки, пустого списка и подгрузки следующей порции. */
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

/** Заголовок колонки, по которому можно упорядочить таблицу. */
interface SortButtonProps {
  /** Текущий порядок по этой колонке. */
  direction: false | 'asc' | 'desc'
  /** Пользователь переключил порядок. */
  onToggle: ((event: unknown) => void) | undefined
  /** Название колонки. */
  children: ReactNode
}

/** Кнопка в заголовке колонки, которая переключает порядок строк. */
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
