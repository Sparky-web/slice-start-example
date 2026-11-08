import { AG_GRID_LOCALE_RU_RU } from '@ag-grid-community/locale'
import type { ColDef, IDatasource, IGetRowsParams } from 'ag-grid-community'
import {
  CsvExportModule,
  InfiniteRowModelModule,
  LocaleModule,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  themeQuartz,
  ValidationModule,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useMemo } from 'react'

import { cn } from '../../lib/cn/cn.ts'
import type { ListPage, ListRequest } from '../../list/listQuery.ts'
import { LIST_PAGE_SIZE } from '../../list/listQuery.ts'

ModuleRegistry.registerModules([
  InfiniteRowModelModule,
  LocaleModule,
  TextFilterModule,
  NumberFilterModule,
  CsvExportModule,
  ...(import.meta.env.DEV ? [ValidationModule] : []),
])

// Тема грида собрана из токенов дизайн-системы и повторяет светлый и тёмный режимы
const theme = themeQuartz.withParams({
  accentColor: 'var(--primary)',
  backgroundColor: 'var(--card)',
  foregroundColor: 'var(--card-foreground)',
  borderColor: 'var(--border)',
  chromeBackgroundColor: 'var(--muted)',
  headerTextColor: 'var(--muted-foreground)',
  rowHoverColor: 'var(--accent)',
  selectedRowBackgroundColor: 'var(--accent)',
  inputBorder: { color: 'var(--input)' },
  fontFamily: 'inherit',
  fontSize: 14,
  headerFontWeight: 500,
  spacing: 8,
  borderRadius: 6,
  wrapperBorderRadius: 8,
})

const textFilterValue = (model: unknown): string | undefined =>
  typeof model === 'object' && model !== null && 'filter' in model && typeof model.filter === 'string' ? model.filter : undefined

/** Переводит выбор пользователя в гриде в единый запрос списка. */
function toListRequest({ startRow, endRow, sortModel, filterModel }: IGetRowsParams): ListRequest {
  const [sort] = sortModel
  const columnFilters: unknown = filterModel
  const entries = typeof columnFilters === 'object' && columnFilters !== null ? Object.entries(columnFilters) : []
  const filters = Object.fromEntries(
    entries.flatMap(([column, model]) => {
      const value = textFilterValue(model)
      return value ? [[column, value]] : []
    }),
  )
  return { offset: startRow, limit: endRow - startRow, sort: sort?.colId, desc: sort ? sort.sort === 'desc' : undefined, filters }
}

/** Настройки грида для больших таблиц. */
export interface DataGridProps<TData> {
  /** Какие колонки показать, какие из них можно упорядочивать и отбирать по тексту. */
  columns: ColDef<TData>[]
  /** Загружает порцию строк с сервера по выбранному порядку и отбору. Передавайте постоянную функцию: новая функция перезагружает грид. */
  fetchRows: (request: ListRequest) => Promise<ListPage<TData>>
  /** Постоянный идентификатор строки. */
  getRowId: (row: TData) => string
  /** Пользователь выбрал строку. */
  onRowClick?: (row: TData) => void
  /** Сколько строк подгружать за раз. */
  pageSize?: number
  /** Редкое исключение для раскладки на странице. */
  className?: string
}

/**
 * Грид для больших таблиц с подгрузкой строк блоками при прокрутке.
 * Пользователь отбирает строки по колонкам, меняет ширину и порядок колонок, выгружает таблицу в файл.
 * Для обычных списков подходит таблица данных.
 */
export function DataGrid<TData>({ columns, fetchRows, getRowId, onRowClick, pageSize = LIST_PAGE_SIZE, className }: DataGridProps<TData>) {
  // Новый источник перезагружает грид, поэтому он меняется только вместе с загрузкой строк
  const datasource = useMemo<IDatasource>(
    () => ({
      getRows: (params) => {
        fetchRows(toListRequest(params)).then(
          ({ items, total }) => {
            params.successCallback(items, total)
          },
          () => {
            params.failCallback()
          },
        )
      },
    }),
    [fetchRows],
  )

  return (
    <div className={cn('h-(--data-table-max-height) w-full', className)}>
      <AgGridReact<TData>
        theme={theme}
        localeText={AG_GRID_LOCALE_RU_RU}
        columnDefs={columns}
        defaultColDef={{ flex: 1, minWidth: 120, sortable: true, resizable: true }}
        rowModelType="infinite"
        datasource={datasource}
        cacheBlockSize={pageSize}
        getRowId={(params) => getRowId(params.data)}
        {...(onRowClick === undefined
          ? {}
          : {
              onRowClicked: (event) => {
                if (event.data) onRowClick(event.data)
              },
            })}
      />
    </div>
  )
}
