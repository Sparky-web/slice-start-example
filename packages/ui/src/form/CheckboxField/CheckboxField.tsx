import type { ReactNode } from 'react'

import { Checkbox } from '../../components/Checkbox/Checkbox.tsx'
import { Field } from '../../components/Field/Field.tsx'
import { fieldErrors, useFieldContext } from '../formContext.ts'

/** Настройки флажка в форме. */
export interface CheckboxFieldProps {
  /** Подпись рядом с флажком. */
  label: ReactNode
  /** Подсказка под флажком. */
  description?: ReactNode
}

/** Флажок в форме: согласие с условиями или включение настройки. */
export function CheckboxField({ label, description }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>()
  return (
    <Field description={description} name={field.name} errors={fieldErrors(field.state.meta)}>
      <Checkbox
        label={label}
        checked={field.state.value}
        onCheckedChange={(checked) => {
          field.handleChange(checked)
        }}
        onBlur={field.handleBlur}
      />
    </Field>
  )
}
