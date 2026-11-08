import type { ReactNode } from 'react'

import { Field } from '../../components/Field/Field.tsx'
import { Textarea } from '../../components/Textarea/Textarea.tsx'
import { fieldErrors, useFieldContext } from '../formContext.ts'

export interface TextareaFieldProps {
  label: ReactNode
  description?: ReactNode
  placeholder?: string
  rows?: number
  required?: boolean
}

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
        onValueChange={(value) => { field.handleChange(value) }}
        onBlur={field.handleBlur}
        {...(placeholder === undefined ? {} : { placeholder })}
        {...(rows === undefined ? {} : { rows })}
      />
    </Field>
  )
}
