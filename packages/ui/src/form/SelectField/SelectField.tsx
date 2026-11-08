import type { ReactNode } from 'react'

import { Field } from '../../components/Field/Field.tsx'
import type { SelectOption } from '../../components/Select/Select.tsx'
import { Select } from '../../components/Select/Select.tsx'
import { fieldErrors, useFieldContext } from '../formContext.ts'

export interface SelectFieldProps<Value extends string> {
  label: ReactNode
  options: readonly SelectOption<Value>[]
  description?: ReactNode
  placeholder?: string
  required?: boolean
}

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
        onValueChange={(value) => { field.handleChange(value) }}
        onBlur={field.handleBlur}
        {...(placeholder === undefined ? {} : { placeholder })}
      />
    </Field>
  )
}
