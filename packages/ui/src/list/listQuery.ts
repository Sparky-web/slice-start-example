import type { QueryKey } from '@tanstack/react-query'
import { infiniteQueryOptions } from '@tanstack/react-query'

/** Сколько строк списка подгружается за один раз. */
export const LIST_PAGE_SIZE = 50

/** Запрос порции строк списка: какую часть показать, как упорядочить и что отобрать. */
export interface ListRequest<TFilters extends object = Record<string, string>> {
  /** Сколько строк пропустить от начала списка. */
  offset: number
  /** Сколько строк вернуть за раз. */
  limit: number
  /** Поле, по которому пользователь упорядочил список. */
  sort?: string | undefined
  /** Порядок от большего к меньшему. */
  desc?: boolean | undefined
  /** Условия отбора, которые выбрал пользователь. */
  filters?: TFilters | undefined
}

/** Порция строк списка и общее число найденных строк. */
export interface ListPage<TItem> {
  /** Строки этой порции. */
  items: TItem[]
  /** Сколько всего строк подходит под условия отбора. */
  total: number
}

/** Настройки списка с подгрузкой по мере прокрутки. */
export interface ListQueryConfig<TItem, TKey extends QueryKey> {
  /** Уникальный ключ списка: от него зависят кэш и обновление после изменений. */
  queryKey: TKey
  /** Загрузка очередной порции строк с сервера. */
  fetchPage: (page: Pick<ListRequest, 'offset' | 'limit'>) => Promise<ListPage<TItem>>
  /** Сколько строк подгружать за раз. */
  pageSize?: number
}

/**
 * Описание списка, который подгружается порциями по мере прокрутки.
 * Следующая порция запрашивается, пока показаны не все найденные строки.
 */
export function listQueryOptions<TItem, TKey extends QueryKey>({ queryKey, fetchPage, pageSize = LIST_PAGE_SIZE }: ListQueryConfig<TItem, TKey>) {
  return infiniteQueryOptions({
    queryKey: [...queryKey, { pageSize }],
    queryFn: ({ pageParam }) => fetchPage({ offset: pageParam, limit: pageSize }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const loaded = pages.reduce((sum, page) => sum + page.items.length, 0)
      return loaded < lastPage.total ? loaded : undefined
    },
  })
}
