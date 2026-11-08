import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { LoaderCircle } from 'lucide-react'

import { cn } from '../../lib/cn/cn.ts'

const spinnerVariants = cva('animate-spin text-current', {
  variants: { size: { sm: 'size-4', md: 'size-6', lg: 'size-8' } },
  defaultVariants: { size: 'md' },
})

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
  label?: string
}

export function Spinner({ size, className, label = 'Загрузка' }: SpinnerProps) {
  return <LoaderCircle role="status" aria-label={label} className={cn(spinnerVariants({ size }), className)} />
}
