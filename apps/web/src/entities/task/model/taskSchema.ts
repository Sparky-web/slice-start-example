import { z } from 'zod'

export const taskStatuses = ['TODO', 'IN_PROGRESS', 'DONE'] as const
export type TaskStatus = (typeof taskStatuses)[number]

export const taskPriorities = ['LOW', 'MEDIUM', 'HIGH'] as const
export type TaskPriority = (typeof taskPriorities)[number]

export const taskStatusLabels: Record<TaskStatus, string> = {
  TODO: 'К выполнению',
  IN_PROGRESS: 'В работе',
  DONE: 'Готово',
}

export const taskPriorityLabels: Record<TaskPriority, string> = {
  LOW: 'Низкий',
  MEDIUM: 'Средний',
  HIGH: 'Высокий',
}

export const taskStatusOptions = taskStatuses.map((value) => ({ value, label: taskStatusLabels[value] }))
export const taskPriorityOptions = taskPriorities.map((value) => ({ value, label: taskPriorityLabels[value] }))

/** Task fields shared by create/edit forms and server functions. */
export const taskInputSchema = z.object({
  title: z.string().trim().min(3, 'Минимум 3 символа').max(120, 'Максимум 120 символов'),
  description: z.string().trim().max(2000, 'Максимум 2000 символов'),
  status: z.enum(taskStatuses, 'Выберите статус'),
  priority: z.enum(taskPriorities, 'Выберите приоритет'),
  dueDate: z.union([z.literal(''), z.iso.date('Укажите дату')]),
})

export type TaskInput = z.infer<typeof taskInputSchema>

export const emptyTaskInput: TaskInput = { title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '' }

export const taskSortFields = ['title', 'status', 'priority', 'dueDate', 'createdAt'] as const
export type TaskSortField = (typeof taskSortFields)[number]

/** Table state stored in the URL: filters and sorting survive reloads and can be shared. */
export const taskListSearchSchema = z.object({
  status: z.enum(taskStatuses).optional().catch(undefined),
  q: z.string().trim().max(80).optional().catch(undefined),
  sort: z.enum(taskSortFields).optional().catch(undefined),
  desc: z.boolean().optional().catch(undefined),
})

export type TaskListSearch = z.infer<typeof taskListSearchSchema>

export interface TaskListItem {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  createdAt: string
}

/** Converts a task to form values (dates as `YYYY-MM-DD`). */
export const toTaskInput = (task: TaskListItem): TaskInput => ({
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  dueDate: task.dueDate?.slice(0, 10) ?? '',
})

/** Converts validated form values to database fields. */
export const toTaskRecord = (input: TaskInput) => ({
  title: input.title,
  description: input.description,
  status: input.status,
  priority: input.priority,
  dueDate: input.dueDate ? new Date(input.dueDate) : null,
})
