import { Field as BaseField } from '@base-ui/react/field'
import type { ReactNode } from 'react'

import { cn } from '../../lib/cn/cn.ts'

/** Настройки поля формы. */
export interface FieldProps {
  /** Подпись поля. */
  label?: ReactNode
  /** Подсказка под полем. Подсказка скрывается, когда поле показывает ошибку. */
  description?: ReactNode
  /** Сообщения об ошибках ввода. */
  errors?: readonly string[]
  /** Имя поля при отправке формы. */
  name?: string
  /** Поле обязательно: рядом с подписью стоит звёздочка. */
  required?: boolean
  /** Пользователь изменил значение. */
  dirty?: boolean
  /** Пользователь уже побывал в поле. */
  touched?: boolean
  /** Поле недоступно. */
  disabled?: boolean
  /** Редкое исключение для раскладки на странице. */
  className?: string
  /** Элемент ввода: строка, список, флажок или многострочное поле. */
  children: ReactNode
}

const NO_ERRORS: readonly string[] = []

/** Поле формы: подпись, элемент ввода, подсказка и ошибки в едином оформлении. */
export function Field({ label, description, errors = NO_ERRORS, name, required, dirty, touched, disabled, className, children }: FieldProps) {
  const invalid = errors.length > 0
  return (
    <BaseField.Root
      invalid={invalid}
      {...(name === undefined ? {} : { name })}
      {...(dirty === undefined ? {} : { dirty })}
      {...(touched === undefined ? {} : { touched })}
      {...(disabled === undefined ? {} : { disabled })}
      className={cn('flex flex-col gap-2', className)}
    >
      {label !== undefined && (
        <BaseField.Label className="text-sm font-medium text-foreground data-disabled:opacity-50">
          {label}
          {required === true && <span className="text-destructive"> *</span>}
        </BaseField.Label>
      )}
      {children}
      {description !== undefined && !invalid && (
        <BaseField.Description className="text-xs text-muted-foreground">{description}</BaseField.Description>
      )}
      <BaseField.Error match={invalid} className="text-xs text-destructive">
        {errors.join('. ')}
      </BaseField.Error>
    </BaseField.Root>
  )
}
