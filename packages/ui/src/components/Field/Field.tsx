import { Field as BaseField } from '@base-ui/react/field'
import type { ReactNode } from 'react'

import { cn } from '../../lib/cn/cn.ts'

export interface FieldProps {
  label?: ReactNode
  description?: ReactNode
  /** Error messages controlled by a form library. */
  errors?: readonly string[]
  name?: string
  required?: boolean
  dirty?: boolean
  touched?: boolean
  disabled?: boolean
  className?: string
  children: ReactNode
}

const NO_ERRORS: readonly string[] = []

/** Label, description and error layout around any form control. */
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
