import { z } from 'zod'

/** Этапы работы над задачей. */
export const taskStatuses = ['TODO', 'IN_PROGRESS', 'DONE'] as const
/** Этап работы над задачей. */
export type TaskStatus = (typeof taskStatuses)[number]

/** Уровни срочности задачи. */
export const taskPriorities = ['LOW', 'MEDIUM', 'HIGH'] as const
/** Срочность задачи. */
export type TaskPriority = (typeof taskPriorities)[number]

/** Названия этапов для пользователя. */
export const taskStatusLabels: Record<TaskStatus, string> = {
  TODO: 'К выполнению',
  IN_PROGRESS: 'В работе',
  DONE: 'Готово',
}

/** Названия уровней срочности для пользователя. */
export const taskPriorityLabels: Record<TaskPriority, string> = {
  LOW: 'Низкий',
  MEDIUM: 'Средний',
  HIGH: 'Высокий',
}

/** Варианты этапа для выбора в форме и фильтре. */
export const taskStatusOptions = taskStatuses.map((value) => ({ value, label: taskStatusLabels[value] }))
/** Варианты срочности для выбора в форме. */
export const taskPriorityOptions = taskPriorities.map((value) => ({ value, label: taskPriorityLabels[value] }))

/** Поля задачи, которые заполняет пользователь. Одни и те же правила действуют в форме и на сервере. */
export const taskInputSchema = z.object({
  title: z.string().trim().min(3, 'Минимум 3 символа').max(120, 'Максимум 120 символов'),
  description: z.string().trim().max(2000, 'Максимум 2000 символов'),
  status: z.enum(taskStatuses, 'Выберите статус'),
  priority: z.enum(taskPriorities, 'Выберите приоритет'),
  dueDate: z.union([z.literal(''), z.iso.date('Укажите дату')]),
})

/** Значения формы задачи. */
export type TaskInput = z.infer<typeof taskInputSchema>

/** Новая задача: этап «К выполнению», средняя срочность, без срока. */
export const emptyTaskInput: TaskInput = { title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '' }

/** Поля, по которым пользователь упорядочивает задачи. */
export const taskSortFields = ['title', 'status', 'priority', 'dueDate', 'createdAt'] as const
/** Поле для упорядочивания задач. */
export type TaskSortField = (typeof taskSortFields)[number]

/** Отбор задач в таблице: по этапу и по тексту в названии. */
export const taskFiltersSchema = z
  .object({
    status: z.enum(taskStatuses).optional(),
    q: z.string().trim().max(80).optional(),
  })
  .default({})

/**
 * Отбор и порядок задач в адресе страницы.
 * Пользователь делится ссылкой, и коллега видит тот же список.
 */
export const taskListSearchSchema = z.object({
  status: z.enum(taskStatuses).optional().catch(undefined),
  q: z.string().trim().max(80).optional().catch(undefined),
  sort: z.enum(taskSortFields).optional().catch(undefined),
  desc: z.boolean().optional().catch(undefined),
})

/** Отбор и порядок задач в адресе страницы. */
export type TaskListSearch = z.infer<typeof taskListSearchSchema>

/** Задача в списке проекта. */
export interface TaskListItem {
  /** Постоянный идентификатор задачи. */
  id: string
  /** Название задачи. */
  title: string
  /** Подробности задачи. */
  description: string
  /** Этап работы. */
  status: TaskStatus
  /** Срочность. */
  priority: TaskPriority
  /** Срок: календарная дата или пустое значение. */
  dueDate: string | null
  /** Момент создания. */
  createdAt: string
}

/** Задача в форме редактирования. */
export const toTaskInput = (task: TaskListItem): TaskInput => ({
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  dueDate: task.dueDate ?? '',
})
