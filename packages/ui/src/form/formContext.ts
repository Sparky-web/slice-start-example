import type { AnyFieldMeta } from '@tanstack/react-form'
import { createFormHookContexts } from '@tanstack/react-form'

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

/** Converts TanStack Form errors (strings or Standard Schema issues) to messages. */
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
