import type { ActionError, ActionResult } from '@repo/lib'
import type { QueryKey } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'

/** Текст, когда сервер не ответил. */
export const NETWORK_ERROR = 'Не удалось связаться с сервером. Проверьте интернет и попробуйте ещё раз.'
/** Текст, когда сервер сломался неожиданно. */
export const UNKNOWN_ERROR = 'Что-то пошло не так. Попробуйте ещё раз.'

/** Ошибки отправки: общая ошибка формы и ошибки отдельных полей. */
export interface SubmitErrors {
  /** Ошибка всей формы. */
  form?: string
  /** Ошибки полей по их именам. */
  fields: Record<string, string>
}

/**
 * Место для отправки в переиспользуемой группе полей.
 * Группа полей подходит к любой форме, которая отправляет данные через действие.
 */
export const submitSlot = (): Promise<SubmitErrors | undefined> => Promise.resolve(undefined)

/** Действие формы: что отправить, как назвать ошибки и что обновить после успеха. */
export interface SubmitActionConfig<TValues, TData, TError extends ActionError<string, Extract<keyof TValues, string>>> {
  /** Отправка значений формы на сервер. */
  action: (values: TValues) => Promise<ActionResult<TData, TError>>
  /** Текст ошибки для пользователя. Каждый код ошибки получает свой текст. */
  errorMessage: (error: TError) => string
  /** Данные, которые устаревают после успеха. Страница загружает их заново. */
  invalidates?: readonly QueryKey[] | ((data: TData) => readonly QueryKey[])
  /** Что сделать после успеха: закрыть диалог или перейти на страницу. */
  onSuccess?: (data: TData) => unknown
}

/**
 * Отправка формы на сервер с понятными ошибками.
 * Ошибка поля появляется под этим полем, общая ошибка появляется над формой.
 * После успеха страница обновляет устаревшие данные.
 */
export function useSubmitAction<TValues, TData, TError extends ActionError<string, Extract<keyof TValues, string>>>(
  config: SubmitActionConfig<TValues, TData, TError>,
) {
  const queryClient = useQueryClient()

  return async ({ value }: { value: TValues }): Promise<SubmitErrors | undefined> => {
    let result: ActionResult<TData, TError>
    try {
      result = await config.action(value)
    } catch (error) {
      console.error(error)
      return { form: error instanceof TypeError ? NETWORK_ERROR : UNKNOWN_ERROR, fields: {} }
    }

    if (!result.ok) {
      const message = config.errorMessage(result.error)
      return result.error.field === undefined ? { form: message, fields: {} } : { fields: { [result.error.field]: message } }
    }

    const keys = typeof config.invalidates === 'function' ? config.invalidates(result.data) : (config.invalidates ?? [])
    await Promise.all(keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })))
    await config.onSuccess?.(result.data)
    return undefined
  }
}
