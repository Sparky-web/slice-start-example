import { z } from 'zod'

/** Поля проекта, которые заполняет пользователь. Одни и те же правила действуют в форме и на сервере. */
export const projectInputSchema = z.object({
  name: z.string().trim().min(2, 'Минимум 2 символа').max(80, 'Максимум 80 символов'),
  description: z.string().trim().max(500, 'Максимум 500 символов'),
})

/** Значения формы проекта. */
export type ProjectInput = z.infer<typeof projectInputSchema>

/** Поля, по которым пользователь упорядочивает проекты. */
export const projectSortFields = ['name', 'createdAt'] as const

/** Отбор проектов по тексту в названии. */
export const projectFiltersSchema = z.object({ name: z.string().trim().max(80).optional() }).default({})

/** Проект в списке и в шапке страницы проекта. */
export interface ProjectListItem {
  /** Постоянный идентификатор проекта. */
  id: string
  /** Название проекта. */
  name: string
  /** Цель проекта и ссылки на материалы. */
  description: string
  /** Сколько всего задач в проекте. */
  taskCount: number
  /** Сколько задач готово. */
  doneCount: number
  /** Момент создания. */
  createdAt: string
}
