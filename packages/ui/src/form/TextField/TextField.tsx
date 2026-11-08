import type { ReactNode } from 'react'

import { Field } from '../../components/Field/Field.tsx'
import { Input } from '../../components/Input/Input.tsx'
import { fieldErrors, useFieldContext } from '../formContext.ts'

/** Настройки однострочного поля формы. */
export interface TextFieldProps {
  /** Подпись поля. */
  label: ReactNode
  /** Подсказка под полем. */
  description?: ReactNode
  /** Пример значения внутри пустого поля. */
  placeholder?: string
  /** Что вводит пользователь: текст, почту, пароль, телефон, число или дату. */
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number' | 'date'
  /** Подсказка браузеру для автозаполнения. */
  autoComplete?: string
  /** Поле обязательно. */
  required?: boolean
  /** Поле недоступно. */
  disabled?: boolean
}

/** Однострочное поле формы с подписью, подсказкой и ошибками проверки. */
export function TextField({ label, description, placeholder, type = 'text', autoComplete, required, disabled }: TextFieldProps) {
  const field = useFieldContext<string>()
  return (
    <Field
      label={label}
      description={description}
      name={field.name}
      errors={fieldErrors(field.state.meta)}
      dirty={field.state.meta.isDirty}
      touched={field.state.meta.isTouched}
      {...(required === undefined ? {} : { required })}
      {...(disabled === undefined ? {} : { disabled })}
    >
      <Input
        type={type}
        value={field.state.value}
        onValueChange={(value) => {
          field.handleChange(value)
        }}
        onBlur={field.handleBlur}
        {...(placeholder === undefined ? {} : { placeholder })}
        {...(autoComplete === undefined ? {} : { autoComplete })}
      />
    </Field>
  )
}
