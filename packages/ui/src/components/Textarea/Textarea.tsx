import { Field } from '@base-ui/react/field'
import type { ComponentProps } from 'react'

import { cn } from '../../lib/cn/cn.ts'
import { controlClassName } from '../Input/Input.tsx'

/** Настройки многострочного поля. */
export interface TextareaProps extends Omit<ComponentProps<'textarea'>, 'className' | 'value' | 'onChange'> {
  /** Редкое исключение для раскладки на странице. */
  className?: string
  /** Текст в поле. */
  value?: string
  /** Пользователь изменил текст. */
  onValueChange?: (value: string) => void
}

/** Многострочное поле для описаний и комментариев. Пользователь может растянуть поле по высоте. */
export function Textarea({ className, value, onValueChange, rows = 4, ...props }: TextareaProps) {
  return (
    <Field.Control
      value={value}
      onValueChange={(next) => onValueChange?.(next)}
      render={<textarea rows={rows} {...props} />}
      className={cn(controlClassName, 'min-h-20 resize-y py-2', className)}
    />
  )
}
