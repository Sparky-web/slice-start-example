import type { AnyFieldMeta } from '@tanstack/react-form'
import { createFormHookContexts } from '@tanstack/react-form'

/** Связь полей дизайн-системы с формой, внутри которой они стоят. */
export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

/**
 * Сообщения об ошибках поля, которые видит пользователь.
 * Ошибки появляются после ухода из поля или после попытки отправить форму.
 */
export function fieldErrors(meta: AnyFieldMeta): string[] {
  if (!meta.isTouched && meta.errorMap.onSubmit === undefined) return []
  return meta.errors.flatMap((error: unknown) => {
    if (typeof error === 'string') return [error]
    if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
      return [error.message]
    }
    return []
  })
}
