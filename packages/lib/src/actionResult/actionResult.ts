/**
 * Ошибка действия с кодом, полем формы и подробностями.
 * Интерфейс по коду выбирает текст ошибки и показывает его у нужного поля.
 */
export interface ActionError<TCode extends string = string, TField extends string = string> {
  /** Код ошибки из закрытого списка действия. */
  code: TCode
  /** Поле формы, к которому относится ошибка. Без поля ошибка относится ко всей форме. */
  field?: TField
  /** Подробности для текста ошибки. */
  params?: object
}

/** Итог действия: успех с данными или ожидаемая ошибка. */
export type ActionResult<TData, TError extends ActionError> = { ok: true; data: TData } | { ok: false; error: TError }

/** Успешный итог действия. */
export const ok = <TData>(data: TData) => ({ ok: true, data }) as const

/** Ожидаемая ошибка действия, например занятое название или чужой проект. */
export const fail = <const TError extends ActionError>(error: TError) => ({ ok: false, error }) as const
