import type { ReactNode } from 'react'

import { cn } from '../../lib/cn/cn.ts'
import { useFormContext } from '../formContext.ts'

export interface FormProps {
  children: ReactNode
  className?: string
}

/** `<form>` wired to the current form: prevents reload and calls `handleSubmit`. */
export function Form({ children, className }: FormProps) {
  const form = useFormContext()
  return (
    <form
      noValidate
      className={cn('flex flex-col gap-4', className)}
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      {children}
    </form>
  )
}
