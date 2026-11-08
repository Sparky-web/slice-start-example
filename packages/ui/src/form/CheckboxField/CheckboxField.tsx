import type { ReactNode } from 'react'

import { Checkbox } from '../../components/Checkbox/Checkbox.tsx'
import { Field } from '../../components/Field/Field.tsx'
import { fieldErrors, useFieldContext } from '../formContext.ts'

export interface CheckboxFieldProps {
  label: ReactNode
  description?: ReactNode
}

export function CheckboxField({ label, description }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>()
  return (
    <Field description={description} name={field.name} errors={fieldErrors(field.state.meta)}>
      <Checkbox
        label={label}
        checked={field.state.value}
        onCheckedChange={(checked) => { field.handleChange(checked) }}
        onBlur={field.handleBlur}
      />
    </Field>
  )
}
