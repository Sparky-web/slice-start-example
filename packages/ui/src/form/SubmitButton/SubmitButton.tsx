import type { ReactNode } from 'react'

import type { ButtonProps } from '../../components/Button/Button.tsx'
import { Button } from '../../components/Button/Button.tsx'
import { useFormContext } from '../formContext.ts'

export interface SubmitButtonProps extends Pick<ButtonProps, 'variant' | 'size' | 'fullWidth'> {
  children: ReactNode
}

/** Submit button that shows a spinner while the form is submitting. */
export function SubmitButton({ children, ...props }: SubmitButtonProps) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" loading={isSubmitting} {...props}>
          {children}
        </Button>
      )}
    </form.Subscribe>
  )
}
