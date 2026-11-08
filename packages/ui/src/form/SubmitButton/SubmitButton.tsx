import type { ReactNode } from 'react'

import type { ButtonProps } from '../../components/Button/Button.tsx'
import { Button } from '../../components/Button/Button.tsx'
import { useFormContext } from '../formContext.ts'

/** Настройки кнопки отправки. */
export interface SubmitButtonProps extends Pick<ButtonProps, 'variant' | 'size' | 'fullWidth'> {
  /** Действие, например «Сохранить». */
  children: ReactNode
}

/** Кнопка отправки формы. Во время отправки кнопка показывает индикатор и не принимает повторные нажатия. */
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
