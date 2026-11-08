import { Input as BaseInput } from '@base-ui/react/input'
import type { ComponentProps } from 'react'

import { cn } from '../../lib/cn/cn.ts'

export const controlClassName =
  'w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 data-invalid:border-destructive data-invalid:ring-destructive/30'

export interface InputProps extends Omit<ComponentProps<typeof BaseInput>, 'className'> {
  className?: string
}

export function Input({ className, ...props }: InputProps) {
  return <BaseInput className={cn(controlClassName, 'h-10', className)} {...props} />
}
