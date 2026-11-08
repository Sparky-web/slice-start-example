import type { ReactNode } from 'react'

import { Field } from '../../components/Field/Field.tsx'
import { Input } from '../../components/Input/Input.tsx'
import { fieldErrors, useFieldContext } from '../formContext.ts'

export interface TextFieldProps {
  label: ReactNode
  description?: ReactNode
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number' | 'date'
  autoComplete?: string
  required?: boolean
  disabled?: boolean
}

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
        onValueChange={(value) => { field.handleChange(value) }}
        onBlur={field.handleBlur}
        {...(placeholder === undefined ? {} : { placeholder })}
        {...(autoComplete === undefined ? {} : { autoComplete })}
      />
    </Field>
  )
}
