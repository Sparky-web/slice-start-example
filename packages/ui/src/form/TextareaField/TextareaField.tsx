import type { ReactNode } from 'react'

import { Field } from '../../components/Field/Field.tsx'
import { Textarea } from '../../components/Textarea/Textarea.tsx'
import { fieldErrors, useFieldContext } from '../formContext.ts'

/** Настройки многострочного поля формы. */
export interface TextareaFieldProps {
  /** Подпись поля. */
  label: ReactNode
  /** Подсказка под полем. */
  description?: ReactNode
  /** Пример текста внутри пустого поля. */
  placeholder?: string
  /** Высота поля в строках. */
  rows?: number
  /** Поле обязательно. */
  required?: boolean
}

/** Многострочное поле формы для описаний и комментариев. */
export function TextareaField({ label, description, placeholder, rows, required }: TextareaFieldProps) {
  const field = useFieldContext<string>()
  return (
    <Field
      label={label}
      description={description}
      name={field.name}
      errors={fieldErrors(field.state.meta)}
      {...(required === undefined ? {} : { required })}
    >
      <Textarea
        value={field.state.value}
        onValueChange={(value) => {
          field.handleChange(value)
        }}
        onBlur={field.handleBlur}
        {...(placeholder === undefined ? {} : { placeholder })}
        {...(rows === undefined ? {} : { rows })}
      />
    </Field>
  )
}
