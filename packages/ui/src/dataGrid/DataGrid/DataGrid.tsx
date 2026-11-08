import { AG_GRID_LOCALE_RU_RU } from '@ag-grid-community/locale'
import type { ColDef, IDatasource, SortModelItem } from 'ag-grid-community'
import {
  CsvExportModule,
  InfiniteRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  themeQuartz,
  ValidationModule,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

import { cn } from '../../lib/cn/cn.ts'

ModuleRegistry.registerModules([
  InfiniteRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  CsvExportModule,
  ...(import.meta.env.DEV ? [ValidationModule] : []),
])

/** AG Grid theme built from design tokens, so the grid follows light/dark modes. */
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

export interface DataGridRequest {
  offset: number
  limit: number
  sort: SortModelItem[]
  filter: Record<string, unknown>
}

export interface DataGridProps<TData> {
  columns: ColDef<TData>[]
  /** Loads a block of rows, `total` is the overall number of rows. */
  fetchRows: (request: DataGridRequest) => Promise<{ items: TData[]; total: number }>
  getRowId: (row: TData) => string
  onRowClick?: (row: TData) => void
  pageSize?: number
  className?: string
}

/**
 * Heavy grid on AG Grid Community (MIT): column filters, resize, reorder, CSV export
 * and lazy loading by blocks (Infinite Row Model). Use `DataTable` for regular lists.
 */
export function DataGrid<TData>({ columns, fetchRows, getRowId, onRowClick, pageSize = 50, className }: DataGridProps<TData>) {
  const datasource: IDatasource = {
    getRows: (params) => {
      fetchRows({
        offset: params.startRow,
        limit: params.endRow - params.startRow,
        sort: params.sortModel,
        filter: params.filterModel as Record<string, unknown>,
      }).then(
        ({ items, total }) => { params.successCallback(items, total) },
        () => { params.failCallback() },
      )
    },
  }

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
        {...(onRowClick === undefined ? {} : { onRowClicked: (event) => { if (event.data) onRowClick(event.data) } })}
      />
    </div>
  )
}
