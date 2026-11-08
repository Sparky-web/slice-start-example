import { Select as BaseSelect } from '@base-ui/react/select'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '../../lib/cn/cn.ts'
import { controlClassName } from '../Input/Input.tsx'

export interface SelectOption<Value extends string> {
  value: Value
  label: string
  disabled?: boolean
}

export interface SelectProps<Value extends string> {
  options: readonly SelectOption<Value>[]
  value: Value | null
  onValueChange: (value: Value | null) => void
  onBlur?: () => void
  placeholder?: string
  disabled?: boolean
  name?: string
  id?: string
  className?: string
}

export function Select<Value extends string>({
  options,
  value,
  onValueChange,
  onBlur,
  placeholder = 'Выберите значение',
  disabled,
  name,
  id,
  className,
}: SelectProps<Value>) {
  return (
    <BaseSelect.Root<Value>
      items={options}
      value={value}
      onValueChange={(next) => {
        onValueChange(next)
      }}
      onOpenChange={(open) => {
        if (!open) onBlur?.()
      }}
      {...(disabled === undefined ? {} : { disabled })}
      {...(name === undefined ? {} : { name })}
      {...(id === undefined ? {} : { id })}
    >
      <BaseSelect.Trigger className={cn(controlClassName, 'flex h-10 items-center justify-between gap-2 text-left', className)}>
        <BaseSelect.Value className="truncate data-placeholder:text-muted-foreground" placeholder={placeholder} />
        <BaseSelect.Icon className="text-muted-foreground">
          <ChevronsUpDown className="size-4" />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner className="z-50 outline-none" sideOffset={4} alignItemWithTrigger={false}>
          <BaseSelect.Popup className="min-w-(--anchor-width) origin-(--transform-origin) overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md transition data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <BaseSelect.List className="max-h-(--available-height) overflow-y-auto p-1">
              {options.map((option) => (
                <BaseSelect.Item
                  key={option.value}
                  value={option.value}
                  {...(option.disabled === undefined ? {} : { disabled: option.disabled })}
                  className="flex cursor-default items-center justify-between gap-2 rounded-sm px-2 py-2 text-sm outline-none select-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                >
                  <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator>
                    <Check className="size-4" />
                  </BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  )
}
