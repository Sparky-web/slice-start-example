import { z } from 'zod'

/** Наибольшая порция строк за один запрос. Защищает базу от слишком тяжёлых запросов. */
export const MAX_LIST_LIMIT = 200

/**
 * Проверка запроса списка от таблиц: порция строк, порядок и условия отбора.
 * Сервер принимает только допустимые условия отбора.
 */
export function listRequestSchema<TFilters extends z.ZodType>(filters: TFilters) {
  return z.object({
    offset: z.number().int().min(0),
    limit: z.number().int().min(1).max(MAX_LIST_LIMIT),
    sort: z.string().max(64).optional(),
    desc: z.boolean().optional(),
    filters,
  })
}
