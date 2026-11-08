import type { ReactNode } from 'react'

import { cn } from '../../lib/cn/cn.ts'
import { useFormContext } from '../formContext.ts'

/** Настройки формы. */
export interface FormProps {
  /** Поля, ошибки и кнопка отправки. */
  children: ReactNode
  /** Редкое исключение для раскладки на странице. */
  className?: string
}

/**
 * Форма отправляет данные без перезагрузки страницы.
 * Ошибка сервера не ломает страницу: форма показывает ошибку в отдельном сообщении.
 */
export function Form({ children, className }: FormProps) {
  const form = useFormContext()
  return (
    <form
      noValidate
      className={cn('flex flex-col gap-4', className)}
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        // Сообщение об ошибке сервера показывает отдельный блок ошибки формы
        form.handleSubmit().catch(() => undefined)
      }}
    >
      {children}
    </form>
  )
}
