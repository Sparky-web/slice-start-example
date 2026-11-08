import { formatDate } from '@repo/lib'

import type { DuplicateTaskTitleError } from '~/entities/task'
import { duplicateTaskTitleMessage } from '~/entities/task'

/** Ожидаемые ошибки создания задачи. */
export type CreateTaskError =
  | { code: 'PROJECT_NOT_FOUND' }
  | DuplicateTaskTitleError
  | { code: 'DUE_DATE_IN_PAST'; field: 'dueDate'; params: { today: string } }

/** Тексты ошибок создания задачи. Каждый код получает понятное объяснение и подсказку. */
export function createTaskErrorMessage(error: CreateTaskError): string {
  switch (error.code) {
    case 'PROJECT_NOT_FOUND': {
      return 'Проект удалён или больше вам недоступен. Обновите страницу.'
    }
    case 'DUPLICATE_TITLE': {
      return duplicateTaskTitleMessage(error)
    }
    case 'DUE_DATE_IN_PAST': {
      return `Срок не может быть раньше сегодняшнего дня: ${formatDate(error.params.today, { preset: 'date', timeZone: 'UTC' })}`
    }
  }
}
