import { Field } from '@base-ui/react/field'
import type { ComponentProps } from 'react'

import { cn } from '../../lib/cn/cn.ts'
import { controlClassName } from '../Input/Input.tsx'

export interface TextareaProps extends Omit<ComponentProps<'textarea'>, 'className' | 'value' | 'onChange'> {
  className?: string
  value?: string
  onValueChange?: (value: string) => void
}

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
