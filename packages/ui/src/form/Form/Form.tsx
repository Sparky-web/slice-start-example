import type { ReactNode } from 'react'

import { cn } from '../../lib/cn/cn.ts'
import { useFormContext } from '../formContext.ts'

export interface FormProps {
  children: ReactNode
  className?: string
}

/**
 * `<form>` wired to the current form: prevents reload and calls `handleSubmit`,
 * so `onSubmit: ({ value }) => mutation.mutateAsync(value)` needs no try/catch.
 */
export function Form({ children, className }: FormProps) {
  const form = useFormContext()
  return (
    <form
      noValidate
      className={cn('flex flex-col gap-4', className)}
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        // Submit errors are shown by <form.FormError error={mutation.error} />, not thrown further
        form.handleSubmit().catch(() => undefined)
      }}
    >
      {children}
    </form>
  )
}
