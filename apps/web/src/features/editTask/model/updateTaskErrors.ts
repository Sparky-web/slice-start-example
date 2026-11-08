import type { DuplicateTaskTitleError } from '~/entities/task'
import { duplicateTaskTitleMessage } from '~/entities/task'

/** Ожидаемые ошибки правки задачи. */
export type UpdateTaskError = { code: 'TASK_NOT_FOUND' } | DuplicateTaskTitleError

/** Тексты ошибок правки задачи. */
export function updateTaskErrorMessage(error: UpdateTaskError): string {
  switch (error.code) {
    case 'TASK_NOT_FOUND': {
      return 'Задачу удалили или перенесли. Обновите страницу.'
    }
    case 'DUPLICATE_TITLE': {
      return duplicateTaskTitleMessage(error)
    }
  }
}
