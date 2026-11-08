import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { Check } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '../../lib/cn/cn.ts'

export interface CheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: ReactNode
  onBlur?: () => void
  disabled?: boolean
  name?: string
  className?: string
}

export function Checkbox({ checked, onCheckedChange, label, onBlur, disabled, name, className }: CheckboxProps) {
  return (
    <label className={cn('inline-flex cursor-pointer items-center gap-2 text-sm select-none', className)}>
      <BaseCheckbox.Root
        checked={checked}
        onCheckedChange={(next) => {
          onCheckedChange(next)
        }}
        {...(onBlur === undefined ? {} : { onBlur })}
        {...(disabled === undefined ? {} : { disabled })}
        {...(name === undefined ? {} : { name })}
        className="flex size-4 shrink-0 items-center justify-center rounded-sm border border-input bg-background transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-disabled:opacity-50 data-invalid:border-destructive"
      >
        <BaseCheckbox.Indicator>
          <Check className="size-3" />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {label}
    </label>
  )
}
