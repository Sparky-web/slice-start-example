/** Порядок строк: от меньшего к большему или наоборот. */
export type SortOrder = 'asc' | 'desc'

/** Какую порцию строк выбрать из базы и в каком порядке. */
export interface PageArgs<TField extends string> {
  /** Сколько строк пропустить. */
  skip: number
  /** Сколько строк выбрать. */
  take: number
  /** Порядок строк. Совпадающие строки всегда идут в одном порядке. */
  orderBy: [Partial<Record<TField, SortOrder>>, { id: 'asc' }]
}

/** Запрос порции строк от таблицы. */
export interface PageRequest {
  /** Сколько строк пропустить. */
  offset: number
  /** Сколько строк выбрать. */
  limit: number
  /** Поле, по которому пользователь упорядочил список. */
  sort?: string | undefined
  /** Порядок от большего к меньшему. */
  desc?: boolean | undefined
}

/**
 * Превращает запрос таблицы в выборку из базы.
 * Пользователь упорядочивает список только по разрешённым полям.
 * Без выбора пользователя новые записи идут первыми.
 */
export function pageArgs<const TField extends string>(request: PageRequest, sortFields: readonly TField[], fallback: TField): PageArgs<TField> {
  const field = sortFields.find((candidate) => candidate === request.sort)
  const order: Partial<Record<TField, SortOrder>> = {}
  order[field ?? fallback] = field === undefined || request.desc === true ? 'desc' : 'asc'
  return { skip: request.offset, take: request.limit, orderBy: [order, { id: 'asc' }] }
}
