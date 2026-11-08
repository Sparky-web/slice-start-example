import type { ReactNode } from 'react'

import { Field } from '../../components/Field/Field.tsx'
import type { SelectOption } from '../../components/Select/Select.tsx'
import { Select } from '../../components/Select/Select.tsx'
import { changeField, fieldErrors, useFieldContext } from '../formContext.ts'

/** Настройки поля выбора в форме. */
export interface SelectFieldProps<Value extends string> {
  /** Подпись поля. */
  label: ReactNode
  /** Варианты, из которых выбирает пользователь. */
  options: readonly SelectOption<Value>[]
  /** Подсказка под полем. */
  description?: ReactNode
  /** Подсказка, пока ничего не выбрано. */
  placeholder?: string
  /** Поле обязательно. */
  required?: boolean
}

/** Поле формы для выбора одного варианта из списка. */
export function SelectField<Value extends string>({ label, options, description, placeholder, required }: SelectFieldProps<Value>) {
  const field = useFieldContext<Value | null>()
  return (
    <Field
      label={label}
      description={description}
      name={field.name}
      errors={fieldErrors(field.state.meta)}
      {...(required === undefined ? {} : { required })}
    >
      <Select
        options={options}
        value={field.state.value}
        onValueChange={(value) => {
          changeField(field, value)
        }}
        onBlur={field.handleBlur}
        {...(placeholder === undefined ? {} : { placeholder })}
      />
    </Field>
  )
}
