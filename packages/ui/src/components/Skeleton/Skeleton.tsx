import { cn } from '../../lib/cn/cn.ts'

export interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden className={cn('h-4 w-full animate-pulse rounded-md bg-muted', className)} />
}
