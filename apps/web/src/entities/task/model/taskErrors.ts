/** В проекте уже есть задача с таким названием. */
export interface DuplicateTaskTitleError {
  /** Код ошибки. */
  code: 'DUPLICATE_TITLE'
  /** Ошибка относится к названию задачи. */
  field: 'title'
  /** Занятое название. */
  params: { title: string }
}

/** Текст ошибки занятого названия. Пользователь видит, какое название уже есть. */
export const duplicateTaskTitleMessage = (error: DuplicateTaskTitleError) => `Задача «${error.params.title}» уже есть в проекте`
